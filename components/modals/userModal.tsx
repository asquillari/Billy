import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '@/hooks/useAppContext';
import { getUserNames, updateUserEmail, updateUserPassword, updateUserName, updateUserSurname, updateUserFullName } from '@/api/api';
//import { getUserNames, getProfileIcon } from '@/api/api';


interface UserProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  profileId: string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isVisible, onClose, onLogout, profileId }) => {
  const { user } = useAppContext();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const names = await getUserNames([user.email]);
          setUserName(names[user.email] || '');
          setUserEmail(user.email);
        } catch (error) {
          console.error('Error fetching user name:', error);
          setUserName('');
        }
      }
    };

    fetchUserData();
  }, [user?.email]);

  const handleEdit = async () => {
    if (isEditing) {
      setIsUpdating(true);
      try {
        
          await updateUserName(profileId, userName);
          console.log('Nombre actualizado');
          console.log(userName);
        
       
        //   await updateUserEmail(profileId, userEmail);
        //   console.log('Email actualizado');
        //   console.log(userEmail);
        
        // Update the user context here if needed
        // For example: updateUser({ ...user, name: userName, email: userEmail });
      } catch (error) {
        console.error('Error updating user information:', error);
        // Revert changes on error
        setUserName(userName);
        setUserEmail(userEmail);
        // Show error message to user
        // For example: showErrorToast('Failed to update profile. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    }
    setIsEditing(!isEditing);
    setEditingField(null);
  };

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log('Change password');
  };

  const handleChangeIcon = () => {
    // Implement icon change logic here
    console.log('Change icon');
  };

  const handleEditField = (field: string) => {
    setEditingField(field === editingField ? null : field);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={30} color="#000000"/>
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Perfil de usuario</Text>

            {/* TODO: falta que el back me de una funcion para obtener el icono anterior. */}
            <View style={styles.iconContainer}>
              <Image 
                source={require('@/assets/images/icons/UserIcon.png')} 
                style={styles.userIcon} 
              />

              {isEditing && (
              <TouchableOpacity style={styles.changeIconButton} onPress={handleChangeIcon}>
                <Text style={styles.changeIconText}>Cambiar Icono</Text>
              </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <View style={styles.editableField}>
                  {isEditing && editingField === 'name' ? (
                    <TextInput 
                      style={[styles.input, styles.visibleInput]}
                      value={userName}
                      onChangeText={setUserName}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.value}>{userName || 'N/A'}</Text>
                  )}
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('name')}>
                      <Icon name="edit" size={20} color="#370185"/>
                    </TouchableOpacity>
                  )}
                </View>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Mail:</Text>
              <View style={styles.editableField}>
                {isEditing && editingField === 'email' ? (
                  <TextInput
                    style={styles.input}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.value}>{userEmail || 'N/A'}</Text>
                )}
                <TouchableOpacity onPress={() => handleEditField('email')}>

                {isEditing &&
                  <Icon name="edit" size={20} color="#370185" />
                }
                </TouchableOpacity>
              </View>
            </View>

            {isEditing && (
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[
                styles.button, 
                isEditing ? styles.saveButton : null,
                isUpdating ? styles.disabledButton : null
              ]} 
              onPress={handleEdit}
              disabled={isUpdating}
            >
              <Text style={styles.buttonText}>
                {isEditing ? (isUpdating ? 'Guardando...' : 'Guardar') : 'Editar'}
              </Text>
            </TouchableOpacity>

              {!isEditing && (
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  changeIconButton: {
    backgroundColor: '#370185',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    paddingTop: 40,
  },
  contentContainer: {
    width: '100%',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: '#370185',
    borderRadius: 24,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#370185',
    marginRight: 10,
    padding: 5,
  },
  visibleInput: {
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});

export default UserProfileModal;
