import React from 'react';
import QRCodeModal from './QRCodeModal';
import CreateSessionModal from './CreateSessionModal';

export default function AppModals({
  isQrModalOpen,
  setIsQrModalOpen,
  isNewSessionModalOpen,
  setIsNewSessionModalOpen,
  displaySession,
  handleCreateSession
}) {
  return (
    <>
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        session={displaySession}
      />

      <CreateSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onCreateSession={handleCreateSession}
      />
    </>
  );
}