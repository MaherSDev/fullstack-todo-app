export interface IRegisterInput {
  name: string;
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
		pattern?: RegExp;
  };
}
