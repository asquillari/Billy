import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '@/hooks/useAppContext';
import { getUserNames } from '@/api/api';
//import { getUserNames, getProfileIcon } from '@/api/api';


interface UserProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;

}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isVisible, onClose, onLogout }) => {
  const { user } = useAppContext(); 
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
 // const [userIcon, setUserIcon] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const names = await getUserNames([user.email]);
          setUserName(names[user.email] || 'N/A');
        //  const icon = await getProfileIcon(user.email);
        //  setUserIcon(icon);
        } catch (error) {
          console.error('Error fetching user name:', error);
          setUserName('N/A');
         // setUserIcon(null);
        }
      }
    };

    fetchUserData();
  }, [user?.email]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log('Change password');
  };

  const handleChangeIcon = () => {
    // Implement icon change logic here
    console.log('Change icon');
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
              <Text style={styles.value}>{userName}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Mail:</Text>
              <Text style={styles.value}>{user?.email || 'N/A'}</Text>
            </View>

            {isEditing && (
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
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
  logoutButton: {
    backgroundColor: '#D32F2F',
  },
});

export default UserProfileModal;