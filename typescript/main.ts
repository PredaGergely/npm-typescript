import * as ko from 'knockout';

class ViewModel {
    words = ko.observableArray(['Hello', 'World']);
}
ko.applyBindings(new ViewModel());