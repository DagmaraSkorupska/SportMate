export interface Sport {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  bio?: string;
  profile_image_url?: string;
}

export interface UserSport {
  sport: string;
  level: string;
}

export interface AppUserWithSports extends User {
  sports: UserSport[];
}
