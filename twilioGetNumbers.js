#!/usr/local/bin/node

class Transactional {
  name() { return 'Need to define the transaction name...'; }
  apply(param) { console.warn(`... you should prolly implement apply(param)`); };
  commit(param) { console.warn(`... you should prolly implement commit(param)`); };
  rollback(param) { console.warn(`... you should prolly implement rollback(param)`) };
}

const Transaction2 = (steps) => {
  const completedSteps = [];
  let nextParam = {};
  this.apply = (param) => {
    nextParam = param;
    let commitable = true;
    steps.forEach((step,i) => { 
     try {
        nextParam = step.apply(nextParam);
        completedSteps.push(step);
      } catch(ex) {
        rollback(step);
        console.error(`Error in step '${step.name()}':  ${ex}`);
        commitable = false;
      }
    });

    if(commitable) {
      completedSteps.forEach((s) => s.commit());
    }
  }

  rollback = (step) => {
    const toRollback = [step, ...completedSteps.reverse()];
    for(var index = 0; index < toRollback.length; index++) {
      const completedStep = toRollback[index];
      try {
        completedStep.rollback();
      } catch(ex) {
        console.log(`Something bad happened while rolling back ${completedStep.name()}: ${ex}`);
      }
    }
  }

  return this;
}

class TwilioNumberRequisition extends Transactional {
  name() { return 'Twilio Number Requisition'; }
  
  apply(param) {
    console.log(`TwilioNumberRequisition::apply = ${JSON.stringify(param, null, ' ')}`);
    return Object.assign(param, { phone: '+12065551212' });
  }

  rollback() {
    console.log(`TwilioNumberRequisition::rollback`);
  }
}

class SalesToolRequisition extends Transactional {
  name() { return 'Banana Stand Requisition'; }
  apply(param) {
    console.log(`SalesToolRequisition::apply = ${JSON.stringify(param, null, ' ')}`);
    return Object.assign(param, { adId: 987 });
  }

  rollback() {
    console.log(`SalesToolRequisition::rollback`);
  }
}

class ReportingRequisition extends Transactional {
  name() { return 'Reporting Requisition'; }
  apply(param) {
    console.log(`ReportingRequisition::apply = ${JSON.stringify(param, null, ' ')}`);
    return Object.assign(param, { adPhoneId: 456 });
  }

  rollback() {
    console.log(`ReportingRequisition::rollback`);
  }
}

class ConsistencyCheck extends Transactional {
  name() { return 'Consistency Check'; }
  apply(param) {
    console.log(`ConsistencyCheck::apply = ${JSON.stringify(param, null, ' ' )}`);
    return Object.assign(param, { consistent: true }); 
  }

  rollback() {
    console.log(`ConsistencyCheck::rollback`);
  }
}

const transaction = Transaction2([new TwilioNumberRequisition(), new SalesToolRequisition(), new ReportingRequisition(), new ConsistencyCheck()]);

transaction.apply({ professionalId: 1234, marketId: 4321, spend: 4200 });

