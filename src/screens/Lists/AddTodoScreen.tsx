import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {
  colors,
  defaultTodoPlaceholders,
  todoColors,
} from '../../utils/constants';
import {useTheme} from '../../utils/hooks';
import DefaultButton from '../../components/DefaultButton';
import DefaultInput from '../../components/DefaultInput';
import Title from '../../components/Title';
import {ITodo, TodosActions} from '../../store/types/todosTypes';
import DefaultCheckbox from '../../components/DefaultCheckbox';
import {ModalWrapper} from '../../components/ModalWrapper';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';

const CIRCLE_SIZE = 26;

export const AddTodoScreen = () => {
  const {styles} = useStyles();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const placeholderRef = useRef(
    defaultTodoPlaceholders[
      Math.floor(Math.random() * defaultTodoPlaceholders.length - 1) + 1
    ],
  ).current;

  const [value, setValue] = useState('');
  const [isTimerEnabled, enableTimer] = useState(false);
  const [willStartOnCreate, setToStartOnCreate] = useState(false);
  const [isModalVisible, showModal] = useState(false);
  const [color, setColor] = useState(todoColors[0]);

  const handleSubmit = () => {
    if (value !== '') {
      const todo = {
        title: value,
        status: willStartOnCreate ? 'active' : 'default',
        isTimerEnabled,
      } as ITodo;

      dispatch({
        type: TodosActions.ADD_TODO,
        payload: todo,
      });
      navigation.goBack();
    }
  };

  const handleSetColor = (c: any) => {
    setColor(c);
    showModal(false);
  };

  const handleEnableTimer = () => enableTimer(prev => !prev);
  const handleStartOnCreate = () => setToStartOnCreate(prev => !prev);
  const handleModalVisibility = () => showModal(prev => !prev);

  useEffect(() => {
    if (!isTimerEnabled) {
      setToStartOnCreate(false);
    }
  }, [isTimerEnabled]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <View style={styles.header}>
          <Title text={'Add todo'} />
        </View>
        <View style={styles.row}>
          <DefaultInput
            value={value}
            placeholder={placeholderRef}
            onChangeText={setValue}
          />
        </View>
        <Pressable onPress={handleModalVisibility}>
          <View style={[styles.row, styles.inline]}>
            <Text style={styles.text}>{color.title}</Text>
            <View
              style={[
                styles.color,
                color.color === 'transparent' ? styles.transparentCircle : null,
                {backgroundColor: color.color},
              ]}
            />
          </View>
        </Pressable>
        <View style={styles.row}>
          <DefaultCheckbox
            title={'Timer'}
            isActive={isTimerEnabled}
            onToggle={handleEnableTimer}
          />
        </View>
        {isTimerEnabled ? (
          <View style={styles.row}>
            <DefaultCheckbox
              title={'Start on create'}
              isActive={willStartOnCreate}
              onToggle={handleStartOnCreate}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.submitContainer}>
        <DefaultButton text={'Add'} onPress={handleSubmit} />
      </View>

      <ModalWrapper isVisible={isModalVisible} onClose={handleModalVisibility}>
        <View style={styles.modalContainer}>
          {todoColors.map((i, k) => (
            <Pressable
              key={`Color_${k}`}
              onPress={() => handleSetColor(todoColors[k])}
              style={styles.colorButton}>
              <View
                style={[
                  styles.color,
                  i.color === 'transparent' ? styles.transparentCircle : null,
                  {backgroundColor: i.color},
                ]}
              />
              <Text style={[styles.text, styles.colorText]}>{i.title}</Text>
            </Pressable>
          ))}
        </View>
      </ModalWrapper>
    </SafeAreaView>
  );
};

const useStyles = () => {
  const {colors, fonts} = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
    },
    header: {
      paddingTop: 50,
    },
    mainWrapper: {
      paddingHorizontal: 15,
      position: 'relative',
    },
    submitContainer: {
      width: Dimensions.get('screen').width - 30,
      position: 'absolute',
      bottom: 15,
      left: 15,
    },
    text: {
      fontWeight: '500',
      fontSize: fonts.medium,
      color: colors.black,
    },
    row: {
      marginBottom: 20,
    },
    inline: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalContainer: {
      paddingHorizontal: 22,
    },
    transparentCircle: {
      borderWidth: 2,
      borderColor: colors.grey,
    },
    color: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE,
    },
    colorButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 8,
    },
    colorText: {
      marginLeft: 10,
    },
  });

  return {styles};
};
