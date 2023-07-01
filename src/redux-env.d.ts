import 'redux'

declare module 'redux' {
    /*
     * This is required to fix redux thunk errors introduced with react-redux version 8
     * Overload to add thunk support to Redux's dispatch() function.
     * Useful for react-redux or any other library which could use this type.
     */
    export interface Dispatch<A extends Action = AnyAction> {
        // eslint-disable-next-line
        <ReturnType = any, State = any, ExtraThunkArg = any>(
            thunkAction: ThunkAction<ReturnType, State, ExtraThunkArg, A>
        ): ReturnType
    }
}
