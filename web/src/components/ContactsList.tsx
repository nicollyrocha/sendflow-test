import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { Box, IconButton, Typography } from "@mui/material";
import type { Contact } from "src/types/contact";
import { subscribeToContacts } from "@functions/contacts.service";
import { formatPhoneNumber } from "../utils";
import { UiCard } from "./UiCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UiDialog } from "./Dialog";
import { UiInput } from "./UiInput";
import { useContacts } from "../hooks/useContacts";

export const ContactsList = () => {
  const { user } = useAuth();
  const [contactFromUser, setContactsFromUser] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState({ status: false, type: "" });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const {
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
  } = useContacts();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToContacts(
      db,
      user.uid,
      (snapshot) => {
        const contacts = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Contact,
        );
        setContactsFromUser(contacts);
      },
      (error) => {
        console.error("Erro ao buscar contatos:", error);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const onClickConfirm = async () => {
    if (openDialog.type === "edit") {
      await handleUpdateContact(
        selectedContact!.id,
        selectedContact!.name,
        selectedContact!.tel,
      );
    } else if (openDialog.type === "delete") {
      await handleDeleteContact(selectedContact!.id);
    }
    setOpenDialog({ status: false, type: "" });
  };

  return (
    <div>
      <UiDialog
        open={openDialog.status}
        handleClose={() => setOpenDialog({ status: false, type: "" })}
        onClickConfirm={onClickConfirm}
        disabled={
          openDialog.type === "edit" &&
          (!selectedContact?.name ||
            !selectedContact?.tel ||
            selectedContact.tel.length < 11)
        }
      >
        {selectedContact && openDialog.type === "edit" && (
          <Box className="flex flex-col gap-5 items-start justify-center pb-8 px-10">
            <Typography variant="h6" className="p-5">
              Editar Contato
            </Typography>
            <UiInput
              label="Nome"
              value={selectedContact.name}
              onChange={(e) =>
                setSelectedContact({ ...selectedContact, name: e.target.value })
              }
            />
            <UiInput
              label="Telefone"
              value={selectedContact.tel}
              onChange={(e) =>
                setSelectedContact({ ...selectedContact, tel: e.target.value })
              }
              error={
                selectedContact.tel.length > 0 &&
                selectedContact.tel.length < 11
              }
              helperText={
                selectedContact.tel.length > 0 &&
                selectedContact.tel.length < 11
                  ? "Número deve conter 11 dígitos"
                  : ""
              }
            />
          </Box>
        )}
        {selectedContact && openDialog.type === "delete" && (
          <Box className="flex flex-col gap-5 items-start justify-center pb-8 px-10">
            <Typography variant="h6" className="p-5">
              Excluir Contato
            </Typography>
            <Typography variant="body1">
              Deseja realmente excluir o contato "{selectedContact.name}"?
            </Typography>
          </Box>
        )}
      </UiDialog>
      <Typography variant="h6" gutterBottom>
        Meus Contatos{" "}
        <span className="text-gray-500 text-md">
          ({contactFromUser.length})
        </span>
      </Typography>
      <div className="flex flex-col gap-2">
        {contactFromUser.map((contact) => (
          <UiCard key={contact.id} className="p-5">
            <Box className="flex items-center justify-between">
              <div className="font-semibold text-lg">{contact.name}</div>
              <div>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpenDialog({ status: true, type: "edit" });
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpenDialog({ status: true, type: "delete" });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </Box>
            <div className="text-gray-500 text-sm mt-1">
              Telefone: {formatPhoneNumber(contact.tel)}
            </div>
          </UiCard>
        ))}
      </div>
    </div>
  );
};
