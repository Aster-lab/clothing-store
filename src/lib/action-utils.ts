import {auth} from './auth';

//uniform format for frontend
export type ActionResponse<T =any> = {
    success: boolean;
    data? : T;
    error? : string;
};


//Wrapper function
export  function withStore<TArgs = any, TResult = any> (
    action : (storeId:string,args:TArgs) => Promise<TResult>
) {
    return  async (args:TArgs) : Promise<ActionResponse<TResult>> => {
        try {
            // Get the sessin first
            const session = await auth();
            const storeId =session?.user?.storeId;

            //Check the store
            if(!storeId) return {success:false,error:'Unauthorized: Store access required.'}
            
            //Run the action
            const data = await action(storeId,args);
            return {success:true,data};
        } catch(error) {
            console.error('[ACTION_ERROR]: ',error);
            return {success:false,error:'An unexpected error occured'};
        }
    };
}

