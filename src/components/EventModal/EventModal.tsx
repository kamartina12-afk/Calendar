import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { IEventFormData } from '../../types/event';
import { formatDate } from '../../utils/dateUtils';
import { styles } from './styles';
import { LABELS } from './labels/labels';
import { IEventModalProps } from './types/types';

export const EventModal: React.FC<IEventModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}) => {
  const isEditMode = !!event;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IEventFormData>({
    defaultValues: {
      title: '',
      date: initialDate || new Date(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      notificationEnabled: true,
    },
  });

  useEffect(() => {
    if (!visible) return;

    if (event) {
      setValue('title', event.title);
      setValue('date', event.date);
      setValue('time', event.time);
      setValue('notificationEnabled', event.notificationEnabled ?? true);
    } else {
      setValue('title', '');
      setValue('date', initialDate || new Date());
      setValue(
        'time',
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
      setValue('notificationEnabled', true);
    }
  }, [event, initialDate, setValue, visible]);

  const onSubmit = (data: IEventFormData) => {
    onSave(data);
    handleClose();
  };

  const handleClose = () => {
    reset({
      title: '',
      date: initialDate || new Date(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      notificationEnabled: true,
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && event) {
      Alert.alert(LABELS.alertDeleteTitle, LABELS.alertDeleteMessage, [
        { text: LABELS.alertCancel, style: 'cancel' },
        {
          text: LABELS.alertDelete,
          style: 'destructive',
          onPress: () => {
            onDelete(event.id);
            handleClose();
          },
        },
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {event ? LABELS.editEvent : LABELS.addEvent}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>{LABELS.close}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.field}>
              <Text style={styles.label}>{LABELS.titleLabel}</Text>
              <Controller
                control={control}
                name="title"
                rules={{
                  required: LABELS.errorTitleRequired,
                  minLength: {
                    value: 3,
                    message: LABELS.errorTitleMinLength,
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={LABELS.titlePlaceholder}
                    placeholderTextColor={styles.placeholder.color}
                  />
                )}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>{LABELS.dateLabel}</Text>
              <Controller
                control={control}
                name="date"
                render={({ field: { value } }) => (
                  <Text style={styles.dateText}>{formatDate(value)}</Text>
                )}
              />
            </View>

            {/* Time Input */}
            <View style={styles.field}>
              <Text style={styles.label}>{LABELS.timeLabel}</Text>
              <Controller
                control={control}
                name="time"
                rules={{
                  required: LABELS.errorTimeRequired,
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: LABELS.errorTimeFormat,
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.time && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={LABELS.timePlaceholder}
                    placeholderTextColor={styles.placeholder.color}
                    keyboardType="numbers-and-punctuation"
                  />
                )}
              />
              {errors.time && (
                <Text style={styles.errorText}>{errors.time.message}</Text>
              )}
            </View>
            <View style={styles.field}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.label}>{LABELS.notificationLabel}</Text>
                  <Text style={styles.switchSubtext}>
                    {LABELS.notificationSubtext}
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="notificationEnabled"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
                      thumbColor={value ? '#6366f1' : '#f3f4f6'}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            {isEditMode && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>
                  {LABELS.buttonDelete}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>
                  {LABELS.buttonCancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.saveButtonText}>
                  {isEditMode ? LABELS.buttonUpdate : LABELS.buttonSave}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
