var TAP = ('ontouchend' in window) ? 'touchend' : 'click';
var item = '<li>{{ name }}</li>';

function showSection(sect) {
    x$('section').each(function () {
        if (this.id == sect)
            x$(this).setStyle('display', 'block');
        else
            x$(this).setStyle('display', 'none');
    });
}

function createAndSaveContact(details, callback) {
    var friend, number, email;

    try {
        friend = navigator.service.contacts.create();
        friend.displayName = details.name;
        friend.nickname = details.name;

        number = new ContactField('default', details.phone, true);
        friend.phoneNumbers = [number];

        email = new ContactField('default', details.email, true);
        friend.emails = [email];

        friend.save();

        callback.call(this, friend);
    } catch (e) {
        alert(e);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    x$('#friendSubmit').on(TAP, function () {
        var filter = x$('#friendName')[0].value;
        if (!filter) {
            // 沒有聯絡資訊
            return;
        } else {
            findContactByName(filter, function (contacts) {
                var i = 0, contactItem, data;
                for (i; i<contacts.length; i++) {
                    data = { name: contacts[i].name.formatted }
                    contactItem = Mustache.to_html(item, data);
                    x$('#friendsList').bottom(contactItem);
                    x$('#friendsList').bottom(contacts[i].name);
                }
            });
        }
    });
	
	x$('a').on(TAP, function () {
        if (this.target)
            showSection(this.target);
        return false;
    });
	
    x$('#newSubmit').on(TAP, function () {
        var name = x$('#newName')[0].value,
            email = x$('#newEmail')[0].value,
            phone = x$('#newPhone')[0].value;

        createAndSaveContact({
            name: name,
            email: email,
            phone: phone
        }, function (newContact) {
            alert("saved new contact " + newContact.displayName);
            showSection('find');
        });
    });
});

function findContactByName(name, callback) {
    function onError() {
        alert('Error: unable to read contacts');
    };
    var fields = ["displayName", "name"],
        options = new ContactFindOptions();
    options.filter = name;
    options.multiple = true;
    // 找到聯絡資訊
    navigator.service.contacts.find(fields, callback, onError, options);
}

