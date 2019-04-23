import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import authReducer from "./reducers/auth";
import feedReducer from "./reducers/feed";
import thunk from "redux-thunk";

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    feed: feedReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

export default store;