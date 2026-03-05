import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Valida e formata número de telefone brasileiro
 * Suporta: (XX) 9XXXX-XXXX ou XX 9XXXX-XXXX
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me();

    const { telefone, retornarFormatado = true } = await req.json();

    if (!telefone) {
      return Response.json({ error: 'Telefone é obrigatório' }, { status: 400 });
    }

    // Remove caracteres especiais
    const cleaned = telefone.replace(/\D/g, '');

    // Validações
    if (cleaned.length < 10 || cleaned.length > 11) {
      return Response.json(
        { error: 'Telefone deve ter 10 ou 11 dígitos' },
        { status: 400 }
      );
    }

    // Validar DDD (deve estar entre 11 e 99)
    const ddd = parseInt(cleaned.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      return Response.json(
        { error: 'DDD inválido' },
        { status: 400 }
      );
    }

    // Validar primeiro dígito após DDD (deve ser 8 ou 9)
    const primeroDigitoNumero = parseInt(cleaned.substring(2, 3));
    if (primeroDigitoNumero !== 8 && primeroDigitoNumero !== 9) {
      return Response.json(
        { error: 'Primeiro dígito deve ser 8 ou 9' },
        { status: 400 }
      );
    }

    // Formatar
    let formatado = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;

    // Alternativa: XX 9XXXX-XXXX
    let formatadoAlt = `${cleaned.substring(0, 2)} ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;

    return Response.json({
      success: true,
      data: {
        valido: true,
        telefone_limpo: cleaned,
        ddd: ddd,
        formato1: formatado, // (XX) 9XXXX-XXXX
        formato2: formatadoAlt, // XX 9XXXX-XXXX
        telefone_formatado: retornarFormatado ? formatado : cleaned,
        eh_celular: cleaned.length === 11,
      },
    });
  } catch (error) {
    console.error('[validarTelefone]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});