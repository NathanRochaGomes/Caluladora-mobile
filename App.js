import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, PaperProvider, Surface, Text } from 'react-native-paper';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingSecondValue, setWaitingSecondValue] = useState(false);

  const formatResult = (value) => {
    if (!Number.isFinite(value)) {
      return 'Error';
    }

    const text = `${value}`;
    return text.length > 12 ? Number(value.toFixed(8)).toString() : text;
  };

  const clearAll = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingSecondValue(false);
  };

  const inputNumber = (number) => {
    if (display === 'Error') {
      setDisplay(number);
      return;
    }

    if (waitingSecondValue) {
      setDisplay(number);
      setWaitingSecondValue(false);
      return;
    }

    setDisplay((previous) => (previous === '0' ? number : previous + number));
  };

  const inputDecimal = () => {
    if (display === 'Error') {
      setDisplay('0.');
      return;
    }

    if (waitingSecondValue) {
      setDisplay('0.');
      setWaitingSecondValue(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay((previous) => previous + '.');
    }
  };

  const performCalculation = (left, right, selectedOperator) => {
    switch (selectedOperator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '×':
        return left * right;
      case '÷':
        return right === 0 ? Infinity : left / right;
      default:
        return right;
    }
  };

  const inputOperator = (nextOperator) => {
    if (display === 'Error') {
      return;
    }

    const currentValue = Number(display);

    if (firstValue === null) {
      setFirstValue(currentValue);
    } else if (operator && !waitingSecondValue) {
      const result = performCalculation(firstValue, currentValue, operator);
      const formattedResult = formatResult(result);
      setDisplay(formattedResult);
      setFirstValue(Number.isFinite(result) ? result : null);
    }

    setOperator(nextOperator);
    setWaitingSecondValue(true);
  };

  const toggleSign = () => {
    if (display === '0' || display === 'Error') {
      return;
    }

    setDisplay((previous) => (previous.startsWith('-') ? previous.slice(1) : `-${previous}`));
  };

  const percentage = () => {
    if (display === 'Error') {
      return;
    }

    const value = Number(display) / 100;
    setDisplay(formatResult(value));
  };

  const calculate = () => {
    if (!operator || waitingSecondValue || display === 'Error' || firstValue === null) {
      return;
    }

    const secondValue = Number(display);
    const result = performCalculation(firstValue, secondValue, operator);
    const formattedResult = formatResult(result);

    setDisplay(formattedResult);
    setFirstValue(Number.isFinite(result) ? result : null);
    setOperator(null);
    setWaitingSecondValue(true);
  };

  const renderButton = (label, onPress, type = 'number', extraStyle = {}) => {
    const buttonColor = type === 'operation' ? '#ff9f0a' : type === 'utility' ? '#a5a5a5' : '#2a2f3d';
    const textColor = type === 'utility' ? '#1d1d1d' : '#fff';

    return (
      <Button
        key={label}
        style={[styles.button, extraStyle]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
        onPress={onPress}
        buttonColor={buttonColor}
        textColor={textColor}
        mode="contained"
        uppercase={false}
      >
        {label}
      </Button>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Surface style={styles.calculator} elevation={4}>
          <Text variant="displaySmall" style={styles.display} numberOfLines={1}>
            {display}
          </Text>

          <View style={styles.row}>
            {renderButton('C', clearAll, 'utility')}
            {renderButton('+/-', toggleSign, 'utility')}
            {renderButton('%', percentage, 'utility')}
            {renderButton('÷', () => inputOperator('÷'), 'operation')}
          </View>

          <View style={styles.row}>
            {renderButton('7', () => inputNumber('7'))}
            {renderButton('8', () => inputNumber('8'))}
            {renderButton('9', () => inputNumber('9'))}
            {renderButton('×', () => inputOperator('×'), 'operation')}
          </View>

          <View style={styles.row}>
            {renderButton('4', () => inputNumber('4'))}
            {renderButton('5', () => inputNumber('5'))}
            {renderButton('6', () => inputNumber('6'))}
            {renderButton('-', () => inputOperator('-'), 'operation')}
          </View>

          <View style={styles.row}>
            {renderButton('1', () => inputNumber('1'))}
            {renderButton('2', () => inputNumber('2'))}
            {renderButton('3', () => inputNumber('3'))}
            {renderButton('+', () => inputOperator('+'), 'operation')}
          </View>

          <View style={styles.row}>
            {renderButton('0', () => inputNumber('0'), 'number', styles.zeroButton)}
            {renderButton('.', inputDecimal)}
            {renderButton('=', calculate, 'operation')}
          </View>
        </Surface>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0d11',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  calculator: {
    backgroundColor: '#151922',
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  display: {
    color: '#fff',
    textAlign: 'right',
    marginBottom: 10,
    paddingHorizontal: 8,
    minHeight: 72,
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 36,
  },
  buttonContent: {
    height: 72,
    borderRadius: 36,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
  },
  zeroButton: {
    flex: 2,
  },
});
