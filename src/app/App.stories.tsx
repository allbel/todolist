import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import App from "./App";
import ReduxStoreProviderDecorator, {BrowserRouterDecorator} from "../trash/ReduxStoreProviderDecorator";

export default {
    title: 'Todolist/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator,BrowserRouterDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App />;

export const AppWithReduxStory = Template.bind({});