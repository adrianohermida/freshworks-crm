import React, { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import ContactList from '../components/contacts/ContactList';
import CreateContactModal from '../components/contacts/CreateContactModal';
import EditContactModal from '../components/contacts/EditContactModal';
import ContactSyncButton from '../components/contacts/ContactSyncButton';
import { useQueryClient } from '@tanstack/react-query';

export default function ContactsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-end">
          <ContactSyncButton />
        </div>
        <ContactList
          onAdd={() => setCreateModalOpen(true)}
          onEdit={(contact) => setEditContact(contact)}
          onDelete={() => handleSuccess()}
        />

        <CreateContactModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleSuccess}
        />

        {editContact && (
          <EditContactModal
            isOpen={!!editContact}
            contact={editContact}
            onClose={() => setEditContact(null)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </PageLayout>
  );
}