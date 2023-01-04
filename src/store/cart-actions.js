import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const getCartData = () => {
    return async(dispatch) => {
        const fetchData = async() => {
            const resp = await fetch(
                'https://shopping-cart-3ef3c-default-rtdb.firebaseio.com/cart.json'
            )

            if(!resp.ok){
                throw new Error('Fetching cart data failed');
            }
        
            const data = await resp.json();
            return data;
        };

        try{
            const cartData = await fetchData();

            dispatch(
                cartActions.replaceCartData({
                    items : cartData.items || [],
                    totalQuantity : cartData.totalQuantity,
                })
            );
        }catch(error){
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Fetching cart data failed.',
            }))
        }
    };
};

export const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'Sending..',
            message: 'Sending cart data..'
        }))

        const sendRequest = async() => {
            const response = await fetch('https://shopping-cart-3ef3c-default-rtdb.firebaseio.com/cart.json',
                {
                    method: 'PUT',
                    body: JSON.stringify({
                      items : cart.items,
                      totalQuantity : cart.totalQuantity,  
                    }),
                }
            )
            if(!response.ok){
                throw new Error('Sending cart data failed.')
            };
        }

        try {
            await sendRequest()

            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sent cart data successfully',
            }))
        }catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed.',
            }))
        }
    }
}