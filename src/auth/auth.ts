interface IContext {
    valid: boolean;
    name: string;
}

// handle all of the token magic here
function validateToken(token: string): Promise<IContext> {
    console.log('validating user - token:', token);
    return Promise.resolve({
        valid: true, // you can pass false here to decline the user operation
        name: 'some_user_name' // pass whatever information you will need in order to validate the user
    });
}

// create context for requests
export function handleGraphQLContext(req: Request): Promise<IContext> {
    // we need to handle the authentication logic here
    // you can pass a user object or any data you want as a context
    const token = req.headers && req.headers.get('auth-token');
    return validateToken(token);
}

// create context for websocket connections
export function handleSubscriptionsContext(connectionParams, webSocket): Promise<IContext> {
    return validateToken(connectionParams.authToken);
}


// check if the user is logged in or whatever you want to do to authenticate the user
export function authenticateContext(context: IContext) {
    if (!context.valid) {
        // too bad 👎
        throw new Error('user is not logged in');
    }
    // all good 👍
}
