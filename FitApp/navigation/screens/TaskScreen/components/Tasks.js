import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

export default function Tasks({ activeTab }) {
  const [tasks, setTasks] = useState([]);
  const [runningTimers, setRunningTimers] = useState({});

  // Varsayılan görevler (test verisi)
  const defaultTasks = [
    { id: 1, text: 'Görev 1', category: 'A', time: 0, isCompleted: false },
    { id: 2, text: 'Görev 2', category: 'B', time: 0, isCompleted: false },
    { id: 3, text: 'Görev 3', category: 'A', time: 0, isCompleted: false },
  ];

  useEffect(() => {
    loadTasks();
    return () => stopAllTimers();
  }, [activeTab]);

  const loadTasks = () => {
    // Veriyi filtreleyerek sadece activeTab'e ait görevleri yükle
    const filteredTasks = defaultTasks.filter(task => task.category === activeTab);
    setTasks(filteredTasks);
  };

  const startTimer = (itemId) => {
    if (runningTimers[itemId]) return;

    const intervalId = setInterval(() => {
      setTasks(prevTasks => {
        const updated = prevTasks.map(task => {
          if (task.id === itemId) {
            return { ...task, time: task.time + 1 };
          }
          return task;
        });
        return updated;
      });
    }, 1000);

    setRunningTimers(prev => ({ ...prev, [itemId]: intervalId }));
  };

  const stopTimer = (itemId) => {
    if (runningTimers[itemId]) {
      clearInterval(runningTimers[itemId]);
      setRunningTimers(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    }
  };

  const stopAllTimers = () => {
    Object.values(runningTimers).forEach(clearInterval);
    setRunningTimers({});
  };

  const toggleComplete = async (itemId) => {
    if (runningTimers[itemId]) {
      Alert.alert('Uyarı', 'Zamanlayıcı çalışırken görevi tamamlayamazsınız.');
      return;
    }

    const updated = tasks.map(task => {
      if (task.id === itemId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });

    setTasks(updated);
  };

  const handleTimerPress = (itemId) => {
    if (runningTimers[itemId]) {
      stopTimer(itemId);
    } else {
      startTimer(itemId);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTasks = ({ item }) => (
    <View style={styles.viewContainer}>
      <View style={styles.taskContainer}>
        <TouchableOpacity
          style={[styles.validityView, item.isCompleted && { backgroundColor: '#7EDB13' }]}
          onPress={() => toggleComplete(item.id)}
        />
        <Text style={styles.nameText}>{item.text}</Text>
      </View>
      <TouchableOpacity style={styles.timeView} onPress={() => handleTimerPress(item.id)}>
        <Text style={styles.timeText}>{formatTime(item.time)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        renderItem={renderTasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#7EDB13',
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: 'rgba(126, 219, 19, 0.1)',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  validityView: {
    height: 35,
    aspectRatio: 1,
    borderRadius: 100,
    borderColor: '#7EDB13',
    borderWidth: 3,
    marginRight: 10,
  },
  nameText: {
    color: '#fff',
    fontSize: 20,
    flex: 1,
  },
  timeView: {
    height: 35,
    aspectRatio: 1,
    borderRadius: 100,
    borderColor: '#7EDB13',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
  },
});
