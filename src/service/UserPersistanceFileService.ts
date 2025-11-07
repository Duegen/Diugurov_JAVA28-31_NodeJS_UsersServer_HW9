export interface UserPersistanceFileService {
    saveDataToFile():Promise<string>;
    restoreDataFromFile():Promise<string>;
}