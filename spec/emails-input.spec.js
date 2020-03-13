"use strict";

let domNodeId = 'firstEmailInput';
let firstEM = new EmailsInput(document.querySelector('#' + domNodeId), { textAddMore: 'custom text from options...' } );
runTests(firstEM, domNodeId);

domNodeId = 'secondEmailInput';
let secondEM = new EmailsInput(document.querySelector('#' + domNodeId));
runTests(secondEM, domNodeId);

function runTests(EM, domNodeId) {
    const testEmail = 'firsttest@gmail.com';
    const testEmails = 'many1@omg.com,many2@sts.com,many3@sts.com';
    let lastEvent = {};
    EM.onChange((e) => { lastEvent = e; });

    describe(domNodeId + " API tests", function () {
        it('set and get Emails', () => {
            const testList = ['test@gmail.com', getRandomEmail(), getRandomEmail()];
            EM.setEmails(testList);
            expect(EM.getEmails()).toEqual(testList);
        }); 
    });
    

    describe(domNodeId + " Emails Input Basic tests", function () {
        it('validate email', () => {
            expect(EM._validateEmail('111')).toBe(false);
            expect(EM._validateEmail('111.')).toBe(false);
            expect(EM._validateEmail('11a.bbb')).toBe(false);

            expect(EM._validateEmail('111@test.com')).toBe(true);
            expect(EM._validateEmail('111abc@test.xyz.com')).toBe(true);
            //add max lenght check
        });

        it('add item: check DOM, get API and subscribe', () => {            
            const beforeAddCount = EM._emailsList.length;
            EM.addOneEmail(testEmail);

            const domItem = document.querySelectorAll('#' + domNodeId + ' .EmailsInput__Item')[EM._emailsList.length - 1];

            const testItem = document.createElement('span');
            testItem.className = 'EmailsInput__Item';

            const testItemText = document.createElement('span');
            testItemText.className = 'EmailsInput__ItemText';
            testItemText.innerText = testEmail;

            const testItemClose = document.createElement('span');
            testItemClose.className = 'EmailsInput__ItemClose';

            testItem.appendChild(testItemText);
            testItem.appendChild(testItemClose);
            //console.log(testItem, domItem);
            expect(domItem).toEqual(testItem);
            expect(EM._emailsList.length).toBe(beforeAddCount + 1);

            expect(lastEvent).toEqual({action: 'add', items: testEmail, newItems: EM.getEmails() });
        });

        it('remove item: check DOM, get API and subscribe', () => {            
            const beforeRemoveCount = EM._emailsList.length;
            const beforeRemoveDomItemsCount = document.querySelectorAll('#' + domNodeId + ' .EmailsInput__Item').length;
            EM._removeItemByEmail(testEmail);
            expect(EM._emailsList.length).toBe(beforeRemoveCount - 1);
            expect(document.querySelectorAll('#' + domNodeId + ' .EmailsInput__Item').length).toBe(beforeRemoveDomItemsCount - 1);
            expect(lastEvent).toEqual({action: 'delete', items: testEmail, newItems: EM.getEmails() });
        });

        it('show userInput after click "add more people"', () => {
            const userInput = document.createElement('input');
            userInput.className = EM._BLOCKNAME + "__UserInput";

            document.querySelector('#' + domNodeId + ' .EmailsInput__AddMoreEmails').click();
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            expect(domUserInput).toEqual(userInput);
        });


        it('userInput should be active', () => {
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            expect(domUserInput).toEqual(document.activeElement);
        });

        it('add item from input after blur', () => {
            const beforeAddCount = EM._emailsList.length;
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            domUserInput.value = 'test123@omg.com';
            domUserInput.blur();
            expect(EM._emailsList.length).toBe(beforeAddCount + 1);
        });
    });

    describe(domNodeId + " Emails Input Paste 3 emails", function () {
        beforeEach(function () {
            jasmine.clock().install();
            const userInput = document.createElement('input');
            userInput.className = EM._BLOCKNAME + "__UserInput";
            //debugger;
            document.querySelector('#' + domNodeId + ' .EmailsInput__AddMoreEmails').click();
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            domUserInput.value = testEmails;
            domUserInput.onpaste();
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('show add many emails from user input immediately', () => {
            const beforeAddCount = EM._emailsList.length;
            //console.log(beforeAddCount);
            jasmine.clock().tick(1000);
            expect(EM._emailsList.length).toBe(beforeAddCount + 3);
            expect(lastEvent).toEqual({action: 'add', items: testEmails.split(','), newItems: EM.getEmails() });
        });
    });


    describe(domNodeId + " Emails Input KeyUp Enter", function () {
        let beforeAddCount;
        beforeEach(function () {        //debugger;
            jasmine.clock().install();
            document.querySelector('#' + domNodeId + ' .EmailsInput__AddMoreEmails').click();
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            domUserInput.value = 'test555@super.com';
            beforeAddCount = EM._emailsList.length;
            domUserInput.onkeyup({ keyCode: 13 });
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('add item from input after pressing Enter', function () {
            jasmine.clock().tick(1000);
            expect(EM._emailsList.length).toBe(beforeAddCount + 1);

        });
    });

    describe(domNodeId + " Emails Input KeyUp Comma", function () {
        let beforeAddCount;
        beforeEach(function () {        //debugger;
            jasmine.clock().install();
            document.querySelector('#' + domNodeId + ' .EmailsInput__AddMoreEmails').click();
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            domUserInput.value = 'comma@super.com';
            beforeAddCount = EM._emailsList.length;
            domUserInput.onkeyup({ keyCode: 188 });
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('add item from input after pressing comma and userInput should be active', function () {
            jasmine.clock().tick(1000);
            expect(EM._emailsList.length).toBe(beforeAddCount + 1);
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            expect(domUserInput).toEqual(document.activeElement);
        });
    });

    describe(domNodeId + "Emails Input KeyUp Backspace", function () {    //TODO: check input with focus
        let beforeRemoveCount;
        beforeEach(function () {        //debugger;        
            jasmine.clock().install();
            beforeRemoveCount = EM._emailsList.length;
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            domUserInput.onkeyup({ keyCode: 8 });
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('remove item pressing backspace and userInput should be active', function () {
            jasmine.clock().tick(1000);
            expect(EM._emailsList.length).toBe(beforeRemoveCount - 1);
            const domUserInput = document.querySelector('#' + domNodeId + ' .EmailsInput__UserInput');
            expect(domUserInput).toEqual(document.activeElement);
        });
    });
}