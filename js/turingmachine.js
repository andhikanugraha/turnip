function TuringMachine() {
  return;
}

TuringMachine.prototype = {
  tape: '',
  state: '',
  position: 0,
  rules: {},

  setTape: function(newTape) {
    this.tape = newTape;
  },

  getTape: function() {
    return this.tape;
  },

  getPosition: function() {
    return this.position;
  },

  addRule: function(currentState, scannedSymbol, printSymbol, direction, nextState) {
    if (!this.rules[currentState]) {
      this.rules[currentState] = {};
    }

    this.rules[currentState][scannedSymbol] = {
      printSymbol: printSymbol,
      direction: direction,
      nextState: nextState
    };

    return this;
  },

  getNextRule: function() {
    if (!this.rules[this.state]) {
      return undefined;
    }

    var currentSymbol = this.tape[this.position];
    if (!this.rules[this.state][currentSymbol]) {
      return undefined;
    }

    else {
      return this.rules[this.state][currentSymbol];
    }
  },

  changeSymbol: function(position, newSymbol) {
    this.tape = this.tape.substring(0, this.position)
                + newSymbol
                + this.tape.substring(this.position + 1);
  },

  step: function() {
    var currentSymbol = this.tape[this.position];

    var nextRule = this.getNextRule();
    if (!nextRule) {
      this.onhalt();
      return false; // Stop
    }

    console.log('Current symbol is ' + currentSymbol);
    console.log('Current state is ' + this.state);
    console.log('Will write symbol ' + nextRule.printSymbol);
    console.log('Will move cursor ' + nextRule.direction);
    console.log('Will change state into ' + nextRule.nextState);

    this.changeSymbol(this.position, nextRule.printSymbol);

    if (nextRule.direction === 'L') {
      --this.position;
      if (this.position < 0) {
        this.tape = ' ' + this.tape;
        this.position = 0;
      }
    }
    if (nextRule.direction === 'R') {
      ++this.position;
      if (this.position >= this.tape.length) {
        this.tape = this.tape + ' ';
      }
    }

    this.state = nextRule.nextState;

    this.onstep(this.state, currentSymbol);

    return this;
  },

  onhalt: function() {},
  onstep: function() {}
}