import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';


interface BalanceCardProps {

    // title: string;
    // totalExpenses: number;
    // myExpenses: number;
    // theyOwe: number;
    // myDebt: number;
    refreshData: () => void;
    sharedUsers: string[];
}

export const SharedBalanceCard: React.FC<BalanceCardProps> = ({ refreshData, sharedUsers }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("test");

    const handleEditPress = () => {
        setIsEditing(true);
      };
    
      const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
      };
    
      const handleTitleSubmit = () => {
        setIsEditing(false);
        
      };

    React.useEffect(() => {
    refreshData();
    }, []);

    return (
        <View style={styles.card}>
         <View style={styles.titleContainer}>
            
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={handleTitleSubmit}
            onSubmitEditing={handleTitleSubmit}
            autoFocus
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
          
          <View style={styles.expensesRow}>
            <View style={styles.expenseItem}>
              <Text style={styles.expenseLabel}>Gastos totales:</Text>
             <Text style={styles.expenseValue}>${"test"}</Text>

              {/* <Text style={styles.expenseValue}>${totalExpenses.toFixed(2)}</Text> */}
            </View>
            <View style={styles.expenseItem}>
              <Text style={styles.expenseLabel}>Mis Gastos:</Text>
              <Text style={styles.expenseValue}>${"test"}</Text>
              {/* <Text style={styles.expenseValue}>${myExpenses.toFixed(2)}</Text> */}
            </View>
          </View>
          
          <View style={styles.expensesRow}>
            <View style={styles.expenseItem}>
              <Text style={styles.expenseLabel}>Te deben:</Text>
              <Text style={styles.expenseValue}>${"test"}</Text>
              {/* <Text style={styles.expenseValue}>${theyOwe.toFixed(2)}</Text> */}
            </View>
            <View style={styles.expenseItem}>
              <Text style={styles.expenseLabel}>Tu deuda:</Text>
              <Text style={styles.expenseValue}>${"test"}</Text>
              {/* <Text style={styles.expenseValue}>${myDebt.toFixed(2)}</Text> */}
            </View>
          </View>
    
          {sharedUsers.map((user, index) => (
            <View key={index} style={styles.userRow}>
             <Image source={{ uri: "@/assets/images/icons/userIcon.png" }} style={styles.avatar} />

              {/* <Image source={{ uri: user.avatar }} style={styles.avatar} /> */}
              <Text style={styles.userName}>{"testUser"}</Text>
              <Text style={styles.expenseValue}>${"testValue"}</Text>
              {/* <Text style={styles.userAmount}>${user.amount.toFixed(2)}</Text> */}
              <Image source={{ uri: "@/assets/images/icons/userIcon.png" }} style={styles.avatar} />

              {/* <Image source={{ uri: user.avatar }} style={styles.avatar} /> */}
            </View>
          ))}
          <Text style={styles.viewAll}>Ver todo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0e6ff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  expensesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
},
expenseItem: {
  flex: 1,
},
expenseLabel: {
  fontSize: 14,
  color: '#666',
},
expenseValue: {
  fontSize: 18,
  fontWeight: 'bold',
},
userRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 8,
},
avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
},
userName: {
  flex: 1,
  marginLeft: 8,
  fontSize: 16,
},
userAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 8,
},
viewAll: {
  textAlign: 'center',
  color: '#666',
  marginTop: 16,
},
titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingBottom: 2,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'black',
  },
});