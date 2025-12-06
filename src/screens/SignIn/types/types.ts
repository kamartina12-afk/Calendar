import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IAuthStackParamList } from "../../../navigation/types";

type SignInScreenNavigationProp = NativeStackNavigationProp<
  IAuthStackParamList,
  'SignIn'
>;

export interface Props {
  navigation: SignInScreenNavigationProp;
}

export interface ISignInFormData {
  email: string;
  password: string;
}
