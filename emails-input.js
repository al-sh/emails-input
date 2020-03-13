"use strict";

function getRandomEmail() {
	const user = Math.random().toString(36).substring(2, 6);
	const domains = ['gmail.com', 'miro.com', 'mail.ru', 'ya.ru', 'icloud.com'];

	return user + '@' + domains[Math.floor(Math.random() * 5)];
}

function EmailsInput(inputContainerNode, options) {
	this._getInputArea = function () {
		if (!inputContainerNode) {
			//todo: check options format
			console.error('inputContainerNode is not a node');
			return false;
		}
		return inputContainerNode
	}

	this._BLOCKNAME = 'EmailsInput';

	//default options	
	this._ADD_MORE_PEOPLE_TEXT = 'add more people...';
	//set options from object
	if (options) {
		if (options.textAddMore) {
			this._ADD_MORE_PEOPLE_TEXT = options.textAddMore;
		}
	}

	this._emailsList = ['test@gmail.com', getRandomEmail(), getRandomEmail(), getRandomEmail()];

	this._onChange = function () {
		//default onchange
	}

	this.onChange = function (callback) {
		this._onChange = callback;
	}

	this._buildInputArea();
}

EmailsInput.prototype._validateEmail = function (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

EmailsInput.prototype._addMoreEmailsAppend = function () {
	const inputArea = this._getInputArea();
	const el = document.createElement('span');
	el.className = this._BLOCKNAME + '__AddMoreEmails';
	el.innerHTML = this._ADD_MORE_PEOPLE_TEXT;
	el.onclick = () => { this.showUserInput(); }
	//el.onclick = function () { this.showUserInput(); }.bind(this); //ie
	inputArea.appendChild(el);
	inputArea.scrollTop = inputArea.scrollHeight - inputArea.clientHeight; //autoscroll to bottom
}

EmailsInput.prototype._addMoreEmailsRemove = function () {
	const el = this._getInputArea().querySelector('.' + this._BLOCKNAME + '__AddMoreEmails');	
	if (el) {
		el.onclick = null; //prevent leak
		el.parentElement.removeChild(el);		
	}
}

EmailsInput.prototype._buildInputArea = function () {
	const inputArea = this._getInputArea();
	inputArea.innerHTML = '';
	this._emailsList.forEach(element => {
		this._renderNewEmail(element);
	});
	this._addMoreEmailsAppend();
};

EmailsInput.prototype._renderNewEmail = function (email) {
	const inputArea = this._getInputArea();

	const newInputAreaItem = document.createElement('span');
	newInputAreaItem.className = this._BLOCKNAME + "__Item";
	if (!this._validateEmail(email)) {
		newInputAreaItem.className = newInputAreaItem.className + ' EmailsInput__Item-invalid';
	}
	const newInputAreaText = document.createElement('span');
	newInputAreaText.className = this._BLOCKNAME + '__ItemText';
	newInputAreaText.innerText = email;
	const newInputAreaClose = document.createElement('span');
	newInputAreaClose.className = this._BLOCKNAME + '__ItemClose';
	newInputAreaClose.onclick = () => { this._removeItemByEmail(email); }
	newInputAreaItem.appendChild(newInputAreaText);
	newInputAreaItem.appendChild(newInputAreaClose);

	inputArea.appendChild(newInputAreaItem);
}

EmailsInput.prototype._removeItemByEmail = function (email) {
	const idx = this._emailsList.indexOf(email);
	this._removeItemByIndex(idx);
}

EmailsInput.prototype._removeItemByIndex = function (idx) {
	const emailToRemove = this._emailsList[idx];
	this._emailsList.splice(idx, 1);
	const inputArea = this._getInputArea();
	let itemToRemove = inputArea.querySelectorAll('.' + this._BLOCKNAME + '__Item')[idx];
	inputArea.removeChild(itemToRemove);
	this._onChange({ action: 'delete', items: emailToRemove, newItems: this._emailsList });
}

EmailsInput.prototype._onUserInputBlur = function (event) {
	const userInput = event.target;
	if (userInput.value !== '') {
		this.addOneEmail(userInput.value);
	} else {
		this._addMoreEmailsAppend();
	}
	this._userInputRemove();
};

EmailsInput.prototype._userInputRemove = function () {
	const el = this._getInputArea().querySelector('.' + this._BLOCKNAME + '__UserInput');
	if (el) {
		el.parentElement.removeChild(el);
	}
}

EmailsInput.prototype.addEmails = function (emails) {
	this._addMoreEmailsRemove();
	for (let i = 0; i < emails.length; i++) {
		this._renderNewEmail(emails[i]);
		this._emailsList.push(emails[i]);
	}
	this._onChange({ action: 'add', items: emails, newItems: this._emailsList });
	this._addMoreEmailsAppend();
}

EmailsInput.prototype.addOneEmail = function (email) {
	this._addMoreEmailsRemove();
	this._renderNewEmail(email);
	this._emailsList.push(email);
	this._onChange({ action: 'add', items: email, newItems: this._emailsList });
	this._addMoreEmailsAppend();
}

EmailsInput.prototype.addRandomEmail = function () {
	this.addOneEmail(getRandomEmail());
}

EmailsInput.prototype.getEmails = function () {
	const result = []; //prevent edit
	this._emailsList.forEach((item) => { result.push(item); }); //Object.assign is not supported in IE, polyfills are forbidden by conditions of the task
	return result;
}

EmailsInput.prototype.setEmails = function (emails) { //TODO: check correct of array
	this._emailsList = emails;
	this._buildInputArea();
}

EmailsInput.prototype.showEmailsCount = function () {
	let validEmailsCount = 0;
	for (let i = 0; i < this._emailsList.length; i++) {
		if (this._validateEmail(this._emailsList[i])) {
			validEmailsCount = validEmailsCount + 1;
		}
	}
	alert(validEmailsCount);//custom alert can be added here
}

EmailsInput.prototype.showUserInput = function () {
	this._addMoreEmailsRemove();
	const inputArea = this._getInputArea();

	const userInput = document.createElement('input');
	userInput.className = this._BLOCKNAME + "__UserInput"
	inputArea.appendChild(userInput);

	userInput.onblur = this._onUserInputBlur.bind(this);

	userInput.onkeyup = (event) => {
		if (event.keyCode === 188) {//comma
			if (userInput.value.replace(',', '') !== '') {
				userInput.value = userInput.value.replace(',', '');
				if (userInput.value !== '') {
					this.addOneEmail(userInput.value);
				}
				userInput.onblur = function () { };
				this._userInputRemove();
				this.showUserInput();
			}
		}
		if (event.keyCode === 13) {//enter
			if (userInput.value !== '') {
				this.addOneEmail(userInput.value);
				userInput.onblur = function () { };
				this._userInputRemove();
			}
		}
		if (event.keyCode === 8) {//backspace
			if (userInput.value === '') {
				const inputArea = this._getInputArea();
				const items = inputArea.querySelectorAll('.' + this._BLOCKNAME + '__Item');
				if (items.length) {
					inputArea.removeChild(items[items.length - 1]);
					this._emailsList.pop();
				}
			}
		}
	}

	userInput.onpaste = (event) => {
		setTimeout(() => {
			if (userInput.value !== '') {
				if (userInput.value !== '') {
					const emails = userInput.value.split(',');
					this.addEmails(emails);
				}
				userInput.onblur = function () { };
				//userInput.removeEventListener('blur', this._onUserInputBlur);
				this._userInputRemove();
			}
		});
	}

	userInput.focus();
}