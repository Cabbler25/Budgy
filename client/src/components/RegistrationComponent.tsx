import { IUserState } from "../redux";



interface IRegistrationProps{
    user: IUserState;
    updateUserLoggedIn: (val: boolean) => void;
    updateUserInfo: (payload: any) => void;
    handleClose: () => void;
}

export default function Registration(props: any){


}