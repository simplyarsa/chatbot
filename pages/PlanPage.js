import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Colors from '../colors';

const PlanPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('Gold');
  const [selectedDuration, setSelectedDuration] = useState('3 Months');
  const [openPlan, setOpenPlan] = useState(null); // Track which plan's details are open

  const plans = [
    {
      title: 'Basic',
      price: '433',
      details: ['Unlimited Messages', 'View 30 Contacts', 'View 50 Contacts'],
    },
    {
      title: 'Silver',
      price: '657',
      details: ['View 30 Contacts', 'View 50 Contacts', 'Unlimited Messages'],
    },
    {
      title: 'Gold',
      price: '854',
      details: ['View 50 Contacts', 'Unlimited Messages', 'View 30 Contacts'],
    },
  ];

  const togglePlanDetails = (plan) => {
    setOpenPlan(openPlan === plan ? null : plan);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.planContainer}>
        {plans.map((plan) => (
          <View key={plan.title} style={{ marginBottom: 8 }}>
            <TouchableOpacity
              style={[
                styles.plan,
                selectedPlan === plan.title && styles.selectedPlan,
                { backgroundColor: plan.title === 'Basic' ? '#d3d3d3' : plan.title === 'Silver' ? '#c0c0c0' : '#ffd700' },
              ]}
              onPress={() => {
                setSelectedPlan(plan.title);
                togglePlanDetails(plan.title);
              }}
            >
              <Text style={styles.planTitle}>
                {plan.title} {plan.title === 'Gold' && <Text style={styles.topSeller}>Top Seller</Text>}
              </Text>
              <Text style={styles.planPrice}>₹{plan.price}/month</Text>

            {openPlan === plan.title && (
                <View style={styles.planDetailsContainer}>
                {plan.details.map((detail, index) => (
                    <Text key={index} style={styles.planDetails}>
                    • {detail}
                  </Text>
                ))}
              </View>
            )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>
          Get {selectedPlan} {selectedDuration} - ₹
          {selectedDuration === '3 Months'
            ? 2562
            : selectedDuration === '6 Months'
            ? 3979
            : 11500}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  planContainer: {
    marginBottom: 16,
  },
  plan: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPlan: {
    borderColor: '#FF4081',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  topSeller: {
    backgroundColor: Colors.primary,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 12,
    marginLeft: 10,
  },
  planPrice: {
    fontSize: 16,
    marginBottom: 4,
  },
  planDetailsContainer: {
    padding: 0,
    marginTop: 8,
  },
  planDetails: {
    fontSize: 16,
    color: '#757575',
    marginVertical: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  durationOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedDuration: {
    borderColor: '#FF4081',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationPrice: {
    fontSize: 14,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  saveText: {
    fontSize: 12,
    color: '#FF4081',
  },
  ctaButton: {
    backgroundColor: '#FF4081',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlanPage;
