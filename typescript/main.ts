import * as ko from 'knockout';

class ViewModel {
    words = ko.observableArray(['Hello', 'There', 'World']);
}
ko.applyBindings(new ViewModel());