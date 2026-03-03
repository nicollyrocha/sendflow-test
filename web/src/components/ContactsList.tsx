import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { Box, IconButton, Input, Typography } from "@mui/material";
import type { Contact } from "src/types/contact";
import {
  deleteContact,
  getContacts,
  updateContact,
} from "@functions/contacts.service";
import { formatPhoneNumber } from "../utils";
import { UiCard } from "./UiCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UiDialog } from "./Dialog";

export const ContactsList = () => {
  const { user } = useAuth();
  const [contactFromUser, setContactsFromUser] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState({ status: false, type: "" });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const getContactsFromUser = async () => {
    if (!user) return;
    try {
      const contacts = await getContacts(db, user?.uid);
      console.log("Contatos do usuário:", contacts);
      setContactsFromUser(
        contacts.map((doc) => ({ id: doc.id, ...doc.data() }) as Contact),
      );
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getContactsFromUser();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    try {
      await updateContact(
        db,
        selectedContact.id,
        selectedContact.name,
        selectedContact.tel,
      );
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
    }
    setOpenDialog({ status: false, type: "" });
    await getContactsFromUser();
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact(db, selectedContact.id);
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
    }
    setOpenDialog({ status: false, type: "" });
    await getContactsFromUser();
  };

  const onClickConfirm = async () => {
    if (openDialog.type === "edit") {
      await handleUpdateContact();
    } else if (openDialog.type === "delete") {
      await handleDeleteContact();
    }
  };

  return (
    <div>
      <UiDialog
        open={openDialog.status}
        handleClose={() => setOpenDialog({ status: false, type: "" })}
        onClickConfirm={onClickConfirm}
      >
        {selectedContact && openDialog.type === "edit" && (
          <Box className="flex flex-col gap-5 items-start justify-center pb-8 px-10">
            <Typography variant="h6" className="p-5">
              Editar Contato
            </Typography>
            <Input
              value={selectedContact.name}
              onChange={(e) =>
                setSelectedContact({ ...selectedContact, name: e.target.value })
              }
            />
            <Input
              value={selectedContact.tel}
              onChange={(e) =>
                setSelectedContact({ ...selectedContact, tel: e.target.value })
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
  );
};
