import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IAuthStackParamList } from "../../../navigation/types";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  IAuthStackParamList,
  'SignUp'
>;

export interface Props {
  navigation: SignUpScreenNavigationProp;
}

export interface ISignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  enableBiometrics: boolean;
}