//imported by name in commonjs
//exported as module.exports={SetMetadata} 

import { SetMetadata } from "@nestjs/common";

//variable exported not changeable
export const ROLES_KEY = 'roles';


//method exported not changeable :: parameter name is roles which will receive array of strings.
//passed key and values to SetMetadata() that lock it 
export const Roles = (...roles:string[]) => SetMetadata(ROLES_KEY,roles);