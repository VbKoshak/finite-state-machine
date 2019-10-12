class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined) {
            throw(new Error('config must be passed'));
        }
        this.config = JSON.parse(JSON.stringify(config));
        this.state = this.config.initial;
        this.history = [this.state];
        this.currentStep = 0;
        this.canReDo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] == undefined) {
            throw(new Error('no such stage'));
        } else {
            this.state = state;
            this.history.push(state);
            this.currentStep++;
            this.canReDo = false;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let res = this.config.states[this.state].transitions[event];
        if (res == undefined) {
            throw(new Error('no such event'));
        } else {
            this.state = res;
            this.history.push(res);
            this.currentStep++;
            this.canReDo = false;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let res = [];
        if (event == undefined){
            for (let key in this.config.states){
                res.push(key);
            }
        } else {
            let transitions = {};
            for (let key in this.config.states){
                for (let st in this.config.states[key].transitions){
                    if (!transitions[st]){
                        transitions[st] = [];
                    }
                    transitions[st].push(key);
                }
            }
            res = transitions[event]? transitions[event] : [];
        }
        return res;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.currentStep > 0){
            this.state = this.history[--this.currentStep];
            this.canReDo = true;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.history.length > this.currentStep+1 && this.canReDo){
            this.state = this.history[++this.currentStep];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.state];
        this.currentStep = 0; 
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
