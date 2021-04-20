interface BaseUserValues {
  displayName: string;
  photoURL: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | number;
  isAnonymous: boolean;
}

export interface UserModel extends BaseUserValues {
  uid: string;

  tenantId: string;
  providerData: ProviderDataModel[];
}

export interface ProviderDataModel {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  phoneNumber: number | string;
  providerId: string;
}

export class ProviderInfo implements ProviderDataModel {
  public uid: string;
  public displayName: string;
  public photoURL: string;
  public email: string;
  public phoneNumber: number | string;
  public providerId: string;

  constructor(pi: any) {
    this.uid = pi.uid;
    this.displayName = pi.displayName;
    this.photoURL = pi.photoURL;
    this.email = pi.email;
    this.phoneNumber = pi.phoneNumber;
    this.providerId = pi.providerId;
  }
}

export class User implements UserModel {
  public uid: string;
  public displayName: string;
  public photoURL: string;
  public email: string;
  public emailVerified: boolean;
  public phoneNumber: number | string;
  public isAnonymous: boolean;
  public tenantId: string;
  public providerData: ProviderDataModel[];

  constructor(user: any) {
    this.uid = user.uid;
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.phoneNumber = user.phoneNumber;
    this.isAnonymous = user.isAnonymous;
    this.tenantId = user.tenantId;
    this.providerData = (user.providerData && user.providerData.length) ?
      user.providerData.map((pd: ProviderDataModel) => new ProviderInfo(pd)) :
      {};
  }
}
