import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Busca dados de um processo específico via TPU Gateway e sincroniza na plataforma
 * @param {string} cnj_number - Número do processo no CNJ (ex: 0000001-00.0000.0.00000.0000000)
 */
const rateLimiter = new Map();

function checkRateLimit(key, maxRequests = 3, windowMs = 60000) {
    const now = Date.now();
    const userLimit = rateLimiter.get(key) || [];
    const recentRequests = userLimit.filter(time => now - time < windowMs);
    if (recentRequests.length >= maxRequests) return false;
    recentRequests.push(now);
    rateLimiter.set(key, recentRequests);
    return true;
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cnj_number, title } = await req.json();

        if (!cnj_number) {
            return Response.json({ error: 'cnj_number is required' }, { status: 400 });
        }

        const rateLimitKey = `${user.email}:${cnj_number}`;
        if (!checkRateLimit(rateLimitKey)) {
            return Response.json({ 
                error: 'Rate limit exceeded. Máximo 3 sincronizações por minuto para este processo.' 
            }, { status: 429 });
        }

        // Fetch from TPU Gateway (no credentials required for public endpoints)
        const TPU_BASE_URL = 'https://gateway.cloud.pje.jus.br/tpu';
        let tpuResponse = null;
        let lastError = null;
        const maxRetries = 3;
        const initialDelay = 1000;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                tpuResponse = await fetch(
                    `${TPU_BASE_URL}/consulta/processos/${cnj_number}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        signal: controller.signal
                    }
                );

                clearTimeout(timeoutId);

                if (tpuResponse.ok) break;

                if (tpuResponse.status >= 500) {
                     lastError = `TPU server error: ${tpuResponse.status}`;
                    if (attempt < maxRetries - 1) {
                        const delay = initialDelay * Math.pow(2, attempt);
                        await new Promise(r => setTimeout(r, delay));
                        continue;
                    }
                } else {
                    lastError = `TPU API error: ${tpuResponse.status}`;
                    break;
                }
            } catch (fetchError) {
                lastError = fetchError.message;
                if (attempt < maxRetries - 1 && !fetchError.message.includes('AbortError')) {
                    const delay = initialDelay * Math.pow(2, attempt);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                break;
            }
        }

        if (!tpuResponse || !tpuResponse.ok) {
            return Response.json({
                error: 'Failed to fetch from TPU Gateway',
                details: lastError || 'Unknown error'
            }, { status: 503 });
        }

        const tpuData = await tpuResponse.json();
        const processData = tpuData.data || tpuData;

        let existingProcesses = [];
        try {
            existingProcesses = await base44.entities.Process.filter({
                cnj_number: cnj_number,
                created_by: user.email
            });
        } catch (e) {
            console.log('Filter error:', e.message);
        }

        let processRecord;
        const now = new Date().toISOString();
        const processTitle = title || processData.nome || processData.numero;

        if (existingProcesses.length > 0) {
            processRecord = existingProcesses[0];
            try {
                await base44.entities.Process.update(processRecord.id, {
                    title: processTitle,
                    synced_at: now,
                    tpu_data: processData,
                    status: 'active'
                });
            } catch (e) {
                console.log('Update error:', e.message);
            }
            processRecord = {
                ...processRecord,
                title: processTitle,
                synced_at: now,
                tpu_data: processData
            };
        } else {
            try {
                processRecord = await base44.entities.Process.create({
                    cnj_number: cnj_number,
                    title: processTitle,
                    synced_at: now,
                    tpu_data: processData,
                    status: 'active'
                });
            } catch (e) {
                console.log('Create error:', e.message);
                return Response.json({
                    success: true,
                    process: {
                        cnj_number,
                        title: processTitle,
                        tpu_data: processData,
                        status: 'active'
                    },
                    partial_sync: true,
                    message: 'Processo sincronizado com TPU Gateway'
                });
            }
        }

        return Response.json({
            success: true,
            process: processRecord,
            synced_at: now
        });

    } catch (error) {
        return Response.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
});