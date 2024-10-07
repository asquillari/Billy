import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getDebtsToUser,getDebtsFromUser, getTotalToPayForUserInDateRange, DebtData, getProfileName, updateProfileName } from '@/api/api';

interface BalanceCardProps {
  currentProfileId: string;
  outcomes: number;
  refreshData: () => void;
  profileEmail: string;
}

interface DebtEntryProps {
  name1: string;
  name2: string;
  amount: number;
}

{/* Debts data component */}
const useDebtsData = (profileEmail: string, currentProfileId: string) => {
  const [totalDebtsToUser, setTotalDebtsToUser] = useState(0);
  const [totalDebtsFromUser, setTotalDebtsFromUser] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);
  const [debtsToUser, setDebtsToUser] = useState<DebtData[]>([]); 
  const [debtsFromUser, setDebtsFromUser] = useState<DebtData[]>([]);

  const fetchDebts = useCallback(async () => {
    try {
      const [debtsToUser, debtsFromUser, totalToPay] = await Promise.all([
        getDebtsToUser(profileEmail, currentProfileId),
        getDebtsFromUser(profileEmail, currentProfileId),
        getTotalToPayForUserInDateRange(profileEmail, currentProfileId, new Date('2024-01-01'), new Date('2024-12-31'))
      ]);

      if (debtsToUser && debtsFromUser) {
        setDebtsToUser(debtsToUser);
        setDebtsFromUser(debtsFromUser);
        setTotalDebtsToUser(debtsToUser.reduce((total, debt) => total + debt.amount, 0));
        setTotalDebtsFromUser(debtsFromUser.reduce((total, debt) => total + debt.amount, 0));
      }
      setTotalToPay(totalToPay);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  }, [profileEmail, currentProfileId]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return { debtsToUser, debtsFromUser, totalDebtsToUser, totalDebtsFromUser, totalToPay, refreshDebts: fetchDebts };
};

{/* Debts entry component */}
export const DebtEntryComponent: React.FC<DebtEntryProps> = ({ name1, name2, amount }) => {
  return (
    <View style={styles.debtEntry}>
      <Text style={styles.debtText}>{name1} le debe a {name2}</Text>
      <View style={styles.debtDetailsContainer}>
        <Image
          source={require('@/assets/images/icons/UserIcon.png')}
          style={styles.avatar}
        />
        <Text style={styles.userAmount}>$ {amount.toFixed(2)}</Text>
        <Image
          source={require('@/assets/images/icons/UserIcon.png')}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

{/* Expense item component */}
const ExpenseItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View style={styles.expenseItem}>
    <Text style={styles.expenseLabel}>{label}</Text>
    <View style={styles.expenseValueContainer}>
      <Text style={styles.expenseValue}>${value.toFixed(2)}</Text>
    </View>
  </View>
);

{/* Shared balance card component */}
export const SharedBalanceCard: React.FC<BalanceCardProps> = ({ currentProfileId, outcomes, refreshData, profileEmail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Bariloche 2025');
  const [isExpanded, setIsExpanded] = useState(false);
  const { debtsToUser, debtsFromUser, totalDebtsToUser, totalDebtsFromUser, totalToPay, refreshDebts } = useDebtsData(profileEmail, currentProfileId);


  useEffect(() => {
    refreshData();
    refreshDebts();
  }, [refreshData, refreshDebts]);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
  };


  return (
    <LinearGradient
    colors={['#e8e0ff', '#d6c5fc']} 
    start={[0, 0]} 
      end={[1, 1]}
      style={styles.card}
    >
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput style={styles.titleInput} value={title} onChangeText={handleTitleChange} onBlur={handleTitleSubmit} onSubmitEditing={handleTitleSubmit} autoFocus />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>

      <View style={styles.expensesContainer}>
        <ExpenseItem label="Gastos totales:" value={outcomes} />
        <ExpenseItem label="Mis Gastos:" value={totalToPay} />
      </View>

      <View style={styles.expensesContainer}>
        <ExpenseItem label="Te deben:" value={totalDebtsToUser} />
        <ExpenseItem label="Tu deuda:" value={totalDebtsFromUser} />
      </View>


      <View style={styles.userDebtSection}>
        {debtsToUser.length > 0 && (
          <DebtEntryComponent name1="Tú" name2={debtsToUser[0].debtor} amount={debtsToUser[0].amount} />
        )}

        {isExpanded && debtsToUser.slice(1).map((debt, index) => (
          <DebtEntryComponent key={debt.id || index} name1="Tú" name2={debt.debtor} amount={debt.amount} />
        ))}

        {isExpanded && debtsFromUser.map((debt, index) => (
          <DebtEntryComponent key={debt.id || index} name1={debt.paid_by} name2={debt.debtor} amount={debt.amount} />
        ))}
      </View>

      <TouchableOpacity onPress={toggleExpanded}>
        <Text style={styles.viewAll}>{isExpanded ? 'Ver menos' : 'Ver todo'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a4a4a',
    flex: 1,
    marginLeft: 8,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingBottom: 2,
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  expensesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expenseItem: {
    flex: 1,
    paddingHorizontal: 8,

  },
  expenseLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseValueContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  expenseValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDebtSection: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  debtEntry: {
    marginBottom: 16,
  },
  debtText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    //fontFamily: 'Roboto_700Bold', // Changed font family

  },
  debtDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f3ff',
    borderRadius: 20,
    padding: 8,
  },
  debtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  viewAll: {
    textAlign: 'center',
    color: '#6200ee',
    marginTop: 16,
    fontSize: 16,
  },
});