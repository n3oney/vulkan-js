import axios from "axios";
import { uuid } from "uuidv4";
import * as request from "./request";

export interface VulkanOptions {
    apiBaseUrl?: string,
    certKey?: string,
    privateKey?: string,
    androidVersion?: string,
    buildTag?: string
}

export interface Certificate {
    CertyfikatKlucz: string,
    CertyfikatKluczSformatowanyTekst: string,
    CertyfikatDataUtworzenia: number,
    CertyfikatDataUtworzeniaSformatowanyTekst: string,
    CertyfikatPfx: string,
    GrupaKlientow: string,
    AdresBazowyRestApi: string,
    UzytkownikLogin: string,
    UzytkownikNazwa: string,
    TypKonta?: string
}

export interface CertificateResponse {
    IsError: boolean,
    IsMessageForUser: boolean
    Message?: string,
    TokenKey?: string,
    TokenStatus: string,
    TokenCert: Certificate
}

export interface StudentsResponse {
    Status: string,
    TimeKey: number,
    TimeValue: string,
    RequestId: string,
    DayOfWeek: number,
    AppVersion: string,
    Data: {
        IdOkresKlasyfikacyjny: number,
        OkresPoziom: number,
        OkresNumer: number,
        OkresDataOd: number,
        OkresDataDo: number,
        OkresDataOdTekst: string,
        OkresDataDoTekst: string,
        IdJednostkaSprawozdawcza: number,
        JednostkaSprawozdawczaSkrot: string,
        JednostkaSprawozdawczaNazwa: string,
        JednostkaSprawozdawczaSymbol: string,
        IdJednostka: number,
        JednostkaNazwa: string,
        JednostkaSkrot: string,
        OddzialSymbol: string,
        OddzialKod: string,
        UzytkownikRola: string,
        UzytkownikLogin: string,
        UzytkownikLoginId: number,
        UzytkownikNazwa: string,
        Przedszkolak: boolean,
        Id: number,
        IdOddzial: number,
        Imie: string,
        Imie2: string,
        Nazwisko: string,
        Pseudonim?: string,
        UczenPlec: number,
        Pozycja: number,
        LoginId: null
    }[]
}

export interface TimetableResponse {
    Status: string,
    TimeKey: number,
    TimeValue: string,
    RequestId: string,
    DayOfWeek: number,
    AppVersion: string,
    Data: {
        Dzien: number,
        DzienTekst: string,
        NumerLekcji: number,
        IdPoraLekcji: number,
        IdPrzedmiot: number,
        PrzedmiotNazwa: string,
        PodzialSkrot?: string,
        Sala: string,
        IdPracownik: number,
        IdPracownikWspomagajacy?: number,
        IdPracownikWspomagajacy2?: number,
        IdPracownikOld?: number,
        IdPracownikWspomagajacyOld?: number,
        IdPracownikWspomagajacy2Old?: number,
        IdPlanLekcji: number,
        AdnotacjaOZmianie: string,
        PrzekreslonaNazwa: boolean,
        PogrubionaNazwa: boolean,
        PlanUcznia: boolean
    }[]
}

export interface Teacher {
    Id: number,
    Imie: string,
    Nazwisko: string,
    Kod: string,
    Aktywny: boolean,
    Nauczyciel: boolean,
    LoginId: string
}

export interface Worker {
    Id: number,
    Imie: string,
    Nazwisko: string,
    Kod: string,
    Aktywny: boolean,
    Nauczyciel: boolean,
    LoginId: string
}

export interface Class {
    Id: number,
    Nazwa: string,
    Kod: string,
    Aktywny: boolean,
    Pozycja: number
}

export interface LessonTime {
    Id: number,
    Numer: number,
    Poczatek: number,
    PoczatekTekst: string,
    Koniec: number,
    KoniecTekst: string
}

export interface GradeCategory {
    Id: number,
    Kod: string,
    Nazwa: string
}

export interface WarningCategory {
    Id: number,
    Nazwa: string,
    Aktywny: boolean
}

export interface PresenceCategory {
    Id: number,
    Nazwa: string,
    Pozycja: number,
    Obecnosc: boolean,
    Nieobecnosc: boolean,
    Zwolnienie: boolean,
    Spoznienie: boolean,
    Usprawiedliwione: boolean,
    Usuniete: boolean
}

export interface PresenceType {
    Id: number,
    Symbol: string,
    Nazwa: string,
    Aktywny: boolean,
    WpisDomyslny: boolean,
    IdKategoriaFrek: number
}

export interface DictionariesResponse {
    Status: string,
    TimeKey: number,
    TimeValue: string,
    RequestId: string,
    DayOfWeek: number,
    AppVersion: string,
    Data: {
        TimeKey: number,
        Nauczyciele: Teacher[],
        Pracownicy: Worker[],
        Przedmioty: Class[],
        PoryLekcji: LessonTime[],
        KategorieOcen: GradeCategory[],
        KategorieUwag: WarningCategory[],
        KategorieFrekwencji: PresenceCategory[],
        TypyFrekwencji: PresenceType[]
    }
}

export default class Vulkan {
    route = "";
    symbol = "";
    fullRoute = "";
    privateKey = "";

    setRouteByToken = async (token: string) => {
        const response = (await axios.get("http://komponenty.vulcan.net.pl/UonetPlusMobile/RoutingRules.txt")).data as string;
        let routesObject = {};
        for (let line of response.split("\n")) {
            if(line.length === 0) continue;
            const parts = line.split(",");
            routesObject[parts[0]] = parts[1].slice(0, -1);
        }
        console.log(routesObject);
        this.route = routesObject[token.substr(0, 3)];
        this.fullRoute = `${this.route}/${this.symbol}`;
    };

    getCertificate = async (token: string, pin: string, symbol: string, deviceName: string, androidVersion: string): Promise<CertificateResponse> => {
        this.symbol = symbol;
        const time = Date.now();
        const res = await axios.post(`${this.route}/${symbol}/mobile-api/Uczen.v3.UczenStart/Certyfikat`, {
            PIN: pin,
            TokenKey: token,
            AppVersion: "18.4.1.388",
            DeviceId: uuid(),
            DeviceName: deviceName,
            DeviceNameUser: "",
            DeviceDescription: "",
            DeviceSystemType: "Android",
            DeviceSystemVersion: androidVersion,
            RemoteMobileTimeKey: time,
            TimeKey: time - 1,
            RequestId: uuid(),
            RemoteMobileAppVersion: "18.4.1.388",
            RemoteMobileAppName: "VULCAN-Android-ModulUcznia"
        }, {
            headers: {
                RequestMobileType: "RegisterDevice",
                "User-Agent": "MobileUserAgent",
                "Content-Type": "application/json"
            }
        });
        this.privateKey = res.data.CertyfikatPfx;
        this.setRouteByToken(token);
        return res.data;
    };

    getStudents = async (certRes: CertificateResponse): Promise<StudentsResponse> => {
        return (await request.request(`${this.fullRoute}/mobile-api/Uczen.v3.UczenStart/ListaUczniow`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
    };

    startApp = async (certRes: CertificateResponse, studentsRes: StudentsResponse): Promise<null> => {
        await request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.UczenStart/LogAppStart`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx);
        return null;
    };

    getTimetable = async (certRes: CertificateResponse, studentsRes: StudentsResponse): Promise<TimetableResponse> => {
        const DataPoczatkowa = new Date().toISOString().replace(/T/, ' ').substr(0, 10);
        const DataKoncowa = new Date(Date.now() + 604800000).toISOString().replace(/T/, ' ').substr(0, 10);

        return (await request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami`, {
            DataPoczatkowa: DataPoczatkowa,
            DataKoncowa: DataKoncowa,
            IdOddzial: studentsRes.Data[0].IdOddzial,
            IdOkresKlasyfikacyjny: studentsRes.Data[0].IdOkresKlasyfikacyjny,
            IdUczen: studentsRes.Data[0].Id
        }, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
    };

    getDictionaries = async (certRes: CertificateResponse, studentsRes: StudentsResponse): Promise<DictionariesResponse> => {
        return (await request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/Slowniki`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
    };

    getTests = async (certRes: CertificateResponse, studentsRes: StudentsResponse): Promise<any> => {
        const DataPoczatkowa = new Date().toISOString().replace(/T/, ' ').substr(0, 10);
        const DataKoncowa = new Date(Date.now() + 604800000).toISOString().replace(/T/, ' ').substr(0, 10);

        return (await request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/Sprawdziany`, {
            DataPoczatkowa: DataPoczatkowa,
            DataKoncowa: DataKoncowa,
            IdOddzial: studentsRes.Data[0].IdOddzial,
            IdOkresKlasyfikacyjny: studentsRes.Data[0].IdOkresKlasyfikacyjny,
            IdUczen: studentsRes.Data[0].Id
        }, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
    }
}
