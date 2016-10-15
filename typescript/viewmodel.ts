import * as ko from 'knockout';

export class ViewModel {
    words = ko.observableArray(['Hello', 'World']);
}