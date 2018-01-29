import { Dataset } from './datatypes'
import { MississippiServiceAreas, TexasServiceAreas } from './states'

export let DATASETS: Dataset[] = [
  {
    dataSources: [
        'Texas',
        'texas_abortion_clinics_address_all.csv'
    ],
    description: 'Abortion Clinics in Texas as of March 2017',
    name: 'Texas Abortion Clinics',
    providers: [
        {
    address: '7324 Southwest Fwy, Houston, TX 77074, USA, Houston, TX 77074',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.701792,
    lng: -95.518138
        },
        {
    address: '6103-6299 Rookin St, Houston, TX 77074, USA, Houston, TX 77074',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.713825,
    lng: -95.498547
        },
        {
    address: '1929 Record Crossing Rd, Dallas, TX 75235, USA, Dallas, TX 75235',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.817751,
    lng: -96.851051
        },
        {
    address: '7075 N Fwy Service Rd, Houston, TX 77091, USA, Houston, TX 77091',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.863774,
    lng: -95.405472
        },
        {
    address: '7402 John Smith Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.506173,
    lng: -98.586049
        },
        {
    address: '7402 John Smith Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.506173,
    lng: -98.586049
        },
        {
    address: '8600 Wurzbach Rd, San Antonio, TX 78240, USA, San Antonio, TX 78240',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.523871,
    lng: -98.569348
        },
        {
    address: '1902 S IH 35 Frontage Rd, Austin, TX 78704, USA, Austin, TX 78704',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.30886,
    lng: -97.754883
        },
        {
    address: '1032 S 15th St, Kingsville, TX 78363, USA, Kingsville, TX 78363',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 27.51973,
    lng: -97.855104
        },
        {
    address: '3932 Bourbon St, Harlingen, TX 78550, USA, Harlingen, TX 78550',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 26.168486,
    lng: -97.68194
        },
        {
    address: '1600 N Campbell St, El Paso, TX 79902, USA, El Paso, TX 79902',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 31.770469,
    lng: -106.49356
        },
        {
    address: '1101 Rosedale St, Houston, TX 77004, USA, Houston, TX 77004',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.72969,
    lng: -95.384352
        },
        {
    address: '9206-9208 Clearock Dr, Austin, TX 78750, USA, Austin, TX 78750',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.444926,
    lng: -97.794926
        },
        {
    address: 'Metroplex Spur, Killeen, TX 76549, USA, Killeen, TX 76549',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 31.017077,
    lng: -97.833092
        },
        {
    address: '4701-4769 Lehigh St, Bellaire, TX 77401, USA, Bellaire, TX 77401',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.722036,
    lng: -95.461362
        },
        {
    address: '4600 Gulfcrest, Houston, TX 77023, USA, Houston, TX 77023',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.725042,
    lng: -95.334562
        },
        {
    address: '7711 Louis Pasteur Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.508927,
    lng: -98.570017
        },
        {
    address: '7567 Greenville Ave, Dallas, TX 75231, USA, Dallas, TX 75231',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.885642,
    lng: -96.758552
        },
        {
    address: '700-798 S 12th St, Waco, TX 76706, USA, Waco, TX 76706',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 31.485899,
    lng: -97.13895
        },
        {
    address: '4600 Gulfcrest, Houston, TX 77023, USA, Houston, TX 77023',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.725042,
    lng: -95.334562
        },
        {
    address: '7202-7298 W Beverly Mae Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.503352,
    lng: -98.582535
        },
        {
    address: '7202-7298 W Beverly Mae Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.503352,
    lng: -98.582535
        },
        {
    address: '4600 Gulfcrest, Houston, TX 77023, USA, Houston, TX 77023',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.725042,
    lng: -95.334562
        },
        {
    address: '12614 U.S. 59 Frontage Rd, Stafford, TX 77477, USA, Stafford, TX 77477',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.49898,
    lng: -95.907
        },
        {
    address: '4135-4141 E 29th St, Bryan, TX 77802, USA, Bryan, TX 77802',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.643449,
    lng: -96.332268
        },
        {
    address: '7989-7991 W Virginia Dr, Dallas, TX 75237, USA, Dallas, TX 75237',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.649944,
    lng: -96.877155
        },
        {
    address: '6220 John Ryan Dr, Fort Worth, TX 76132, USA, Fort Worth, TX 76132',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.659888,
    lng: -97.420266
        },
        {
    address: '11528 Perrin Beitel Rd, San Antonio, TX 78217, USA, San Antonio, TX 78217',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.544813,
    lng: -98.410785
        },
        {
    address: '157-187 E Ben White Blvd, Austin, TX 78704, USA, Austin, TX 78704',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.222929,
    lng: -97.763192
        },
        {
    address: '7202-7298 W Beverly Mae Dr, San Antonio, TX 78229, USA, San Antonio, TX 78229',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.503352,
    lng: -98.582535
        },
        {
    address: '1300-1312 58th St, Lubbock, TX 79412, USA, Lubbock, TX 79412',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 33.540832,
    lng: -101.849307
        },
        {
    address: '601-647 Langtry St, El Paso, TX 79902, USA, El Paso, TX 79902',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 31.770255,
    lng: -106.477284
        },
        {
    address: '4313 N Central Expy, Dallas, TX 75205, USA, Dallas, TX 75205',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.817539,
    lng: -96.788955
        },
        {
    address: '2001-2099 Pecos St, San Angelo, TX 76901, USA, San Angelo, TX 76901',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 31.457329,
    lng: -100.457204
        },
        {
    address: '8622 Greenville Ave, Dallas, TX 75243, USA, Dallas, TX 75243',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.894466,
    lng: -96.752692
        },
        {
    address: '3105-3121 Richmond Ave, Houston, TX 77098, USA, Houston, TX 77098',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.733584,
    lng: -95.425341
        },
        {
    address: '6656-6660 Tarnef Dr, Houston, TX 77074, USA, Houston, TX 77074',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.707567,
    lng: -95.500836
        },
        {
    address: '2510 N Shepherd Dr, Houston, TX 77008, USA, Houston, TX 77008',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.808977,
    lng: -95.410089
        },
        {
    address: '1950 S Las Vegas Trail, White Settlement, TX 76108, USA, White Settlement, TX 76108',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.740076,
    lng: -97.469275
        },
        {
    address: '200, 8401 N Interstate 35 Frontage Rd, Austin, TX 78753, USA, Austin, TX 78753',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.378554,
    lng: -97.676445
        },
        {
    address: '440 N 18th St, Beaumont, TX 77707, USA, Beaumont, TX 77707',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 30.084564,
    lng: -94.137414
        },
        {
    address: '3250-3264 Lackland Rd, Fort Worth, TX 76116, USA, Fort Worth, TX 76116',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 32.724898,
    lng: -97.435538
        },
        {
    address: '801 S Main St, McAllen, TX 78501, USA, McAllen, TX 78501',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 26.196844,
    lng: -98.235697
        },
        {
    address: '4025 E Southcross, San Antonio, TX 78222, USA, San Antonio, TX 78222',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.374903,
    lng: -98.416022
        },
        {
    address: '4025 E Southcross, San Antonio, TX 78222, USA, San Antonio, TX 78222',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.374903,
    lng: -98.416022
        },
        {
    address: '8316-8358 Wednesbury Ln, Houston, TX 77074, USA, Houston, TX 77074',
    languages: [],
    npi: '0',
    specialty: 'Abortion Clinic',
    lat: 29.687996,
    lng: -95.526151
        }
    ],
    serviceAreaIds: TexasServiceAreas
},
  {
    dataSources: ['Mock Service Areas', 'Mock Providers'],
    name: 'Fresno Mock Data',
    description: 'A mock dataset in Fresno, CA',
    providers: [
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1992840490', specialty: 'Internal Medicine', lat: 36.828675, lng: -119.78198},
        {address: '5150 N 6TH ST, FRESNO, CA 93710', languages: ['Burmese', 'Chinese'], npi: '1740295419', specialty: 'Internal Medicine', lat: 36.811246, lng: -119.762693},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1992977888', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1992977888', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1992977888', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6081 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.824933, lng: -119.774794},
        {address: '6081 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.824933, lng: -119.774794},
        {address: '6181 N THESTA AVE, FRESNO, CA 93710', languages: [], npi: '1780670091', specialty: 'Internal Medicine', lat: 36.826196, lng: -119.783354},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: [], npi: '1629382213', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6323 N FRESNO ST, FRESNO, CA 93710', languages: ['Panjabi'], npi: '1144537317', specialty: 'Internal Medicine', lat: 36.828697, lng: -119.78284},
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1528176500', specialty: 'Internal Medicine', lat: 36.828675, lng: -119.78198},
        {address: '6181 N THESTA AVE, FRESNO, CA 93710', languages: [], npi: '1801978457', specialty: 'Family Practice', lat: 36.826196, lng: -119.783354},
        {address: '5088 N FRESNO, FRESNO, CA 93710', languages: [], npi: '1437256211', specialty: 'Pediatrics', lat: 36.200633, lng: -120.096634},
        {address: '5088 N FRESNO, FRESNO, CA 93710', languages: [], npi: '1437256211', specialty: 'Pediatrics', lat: 36.200633, lng: -120.096634},
        {address: '6181 N THESTA AVE, FRESNO, CA 93710', languages: [], npi: '1902890296', specialty: 'Family Practice', lat: 36.826196, lng: -119.783354},
        {address: '6769 N WILLOW AVE, FRESNO, CA 93710', languages: ['Hindi', 'Spanish'], npi: '1679657043', specialty: 'Pediatrics', lat: 36.835099, lng: -119.731432},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1669498622', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1669498622', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1669498622', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '5680 N FRESNO ST, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi', 'Panjabi'], npi: '1346203973', specialty: 'Internal Medicine', lat: 36.821883, lng: -119.764561},
        {address: '5680 N FRESNO ST, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi', 'Panjabi'], npi: '1346203973', specialty: 'Internal Medicine', lat: 36.821883, lng: -119.764561},
        {address: '6311 N FRESNO, FRESNO, CA 93710', languages: [], npi: '1578583597', specialty: 'Internal Medicine', lat: 36.200633, lng: -120.096634},
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1992091623', specialty: 'Family Practice', lat: 36.828675, lng: -119.78198},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1518130822', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1518130822', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6121 N THESTA ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1518130822', specialty: 'Obstetrics/Gynecology', lat: 36.824959, lng: -119.783699},
        {address: '6769 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Hmong'], npi: '1427011964', specialty: 'Family Practice', lat: 36.837197, lng: -119.781556},
        {address: '6769 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Hmong'], npi: '1427011964', specialty: 'Family Practice', lat: 36.837197, lng: -119.781556},
        {address: '6769 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Laotian', 'Thai'], npi: '1336173848', specialty: 'Family Practice', lat: 36.837197, lng: -119.781556},
        {address: '6769 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Laotian', 'Thai'], npi: '1336173848', specialty: 'Family Practice', lat: 36.837197, lng: -119.781556},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish', 'Tagalog'], npi: '1366502502', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish', 'Tagalog'], npi: '1366502502', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish', 'Tagalog'], npi: '1366502502', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish', 'Tagalog'], npi: '1366502502', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Tagalog', 'Spanish'], npi: '1700990306', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Tagalog', 'Spanish'], npi: '1700990306', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Tagalog', 'Spanish'], npi: '1700990306', specialty: 'Pediatrics', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Chinese'], npi: '1073691986', specialty: 'Internal Medicine', lat: 36.835896, lng: -119.771569},
        {address: '6700 N 1ST ST, FRESNO, CA 93710', languages: ['Chinese'], npi: '1073691986', specialty: 'Internal Medicine', lat: 36.835896, lng: -119.771569},
        {address: '1177 E WARNER AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1487656021', specialty: 'Family Practice', lat: 36.83581, lng: -119.767951},
        {address: '1177 E WARNER AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1487656021', specialty: 'Family Practice', lat: 36.83581, lng: -119.767951},
        {address: '1177 E WARNER AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1891731477', specialty: 'Internal Medicine', lat: 36.83581, lng: -119.767951},
        {address: '1177 E WARNER AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1891731477', specialty: 'Internal Medicine', lat: 36.83581, lng: -119.767951},
        {address: '6125 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1326132903', specialty: 'Obstetrics/Gynecology', lat: 36.824976, lng: -119.781824},
        {address: '6125 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1326132903', specialty: 'Obstetrics/Gynecology', lat: 36.824976, lng: -119.781824},
        {address: '6125 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1326132903', specialty: 'Obstetrics/Gynecology', lat: 36.824976, lng: -119.781824},
        {address: '371 E BULLARD AVE, FRESNO, CA 93710', languages: [], npi: '1225195365', specialty: 'Pediatrics', lat: 36.822689, lng: -119.782175},
        {address: '371 E BULLARD AVE, FRESNO, CA 93710', languages: [], npi: '1225195365', specialty: 'Pediatrics', lat: 36.822689, lng: -119.782175},
        {address: '371 E BULLARD AVE, FRESNO, CA 93710', languages: [], npi: '1225195365', specialty: 'Pediatrics', lat: 36.822689, lng: -119.782175},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Panjabi'], npi: '1063419364', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1972500924', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1972500924', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1215934526', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1215934526', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1184790735', specialty: 'Obstetrics/Gynecology', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1851398150', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1528066560', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1528066560', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1528066560', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1952309437', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1952309437', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1952309437', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Armenian', 'Farsi'], npi: '1215967054', specialty: 'Pediatrics', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Armenian', 'Farsi'], npi: '1215967054', specialty: 'Pediatrics', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Armenian', 'Farsi'], npi: '1215967054', specialty: 'Pediatrics', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1417949629', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1659313567', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'German'], npi: '1003931304', specialty: 'Obstetrics/Gynecology', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'German'], npi: '1003931304', specialty: 'Obstetrics/Gynecology', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Russian'], npi: '1245556315', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Romanian'], npi: '1912909458', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Romanian'], npi: '1912909458', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['French', 'Romanian'], npi: '1912909458', specialty: 'Internal Medicine', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1649354465', specialty: 'Obstetrics/Gynecology', lat: 36.828791, lng: -119.783182},
        {address: '6327 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1649354465', specialty: 'Obstetrics/Gynecology', lat: 36.828791, lng: -119.783182},
        {address: '6255 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1770591604', specialty: 'Pediatrics', lat: 36.827616, lng: -119.781732},
        {address: '6079 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi', 'Panjabi'], npi: '1386750487', specialty: 'Internal Medicine', lat: 36.824337, lng: -119.781779},
        {address: '6079 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi', 'Panjabi'], npi: '1386750487', specialty: 'Internal Medicine', lat: 36.824337, lng: -119.781779},
        {address: '6042 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1780622324', specialty: 'Internal Medicine', lat: 36.823784, lng: -119.780653},
        {address: '6042 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1780622324', specialty: 'Internal Medicine', lat: 36.823784, lng: -119.780653},
        {address: '6042 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1780622324', specialty: 'Internal Medicine', lat: 36.823784, lng: -119.780653},
        {address: '6331 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1760476386', specialty: 'Family Practice', lat: 36.828918, lng: -119.782838},
        {address: '6331 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1760476386', specialty: 'Family Practice', lat: 36.828918, lng: -119.782838},
        {address: '6331 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1760476386', specialty: 'Family Practice', lat: 36.828918, lng: -119.782838},
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1659384295', specialty: 'Internal Medicine', lat: 36.828675, lng: -119.78198},
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1659384295', specialty: 'Internal Medicine', lat: 36.828675, lng: -119.78198},
        {address: '6311 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1659384295', specialty: 'Internal Medicine', lat: 36.828675, lng: -119.78198},
        {address: '6107 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1487665535', specialty: 'Obstetrics/Gynecology', lat: 36.825165, lng: -119.7729},
        {address: '6107 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1487665535', specialty: 'Obstetrics/Gynecology', lat: 36.825165, lng: -119.7729},
        {address: '6089 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1801824164', specialty: 'Family Practice', lat: 36.825209, lng: -119.77425},
        {address: '6089 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1801824164', specialty: 'Family Practice', lat: 36.825209, lng: -119.77425},
        {address: '6089 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1801824164', specialty: 'Family Practice', lat: 36.825209, lng: -119.77425},
        {address: '6081 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.824933, lng: -119.774794},
        {address: '6081 N 1ST ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.824933, lng: -119.774794},
        {address: '6069 N 1ST ST, FRESNO, CA 93710', languages: [], npi: '1336156728', specialty: 'Internal Medicine', lat: 36.824559, lng: -119.77363},
        {address: '6069 N 1ST ST, FRESNO, CA 93710', languages: [], npi: '1336156728', specialty: 'Internal Medicine', lat: 36.824559, lng: -119.77363},
        {address: '728 E BULLARD AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.823726, lng: -119.774169},
        {address: '728 E BULLARD AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1720117138', specialty: 'General Practice', lat: 36.823726, lng: -119.774169},
        {address: '6246 N 1ST ST, FRESNO, CA 93710', languages: [], npi: '1588625826', specialty: 'Internal Medicine', lat: 36.82747, lng: -119.771779},
        {address: '6769 N WILLOW AVE, FRESNO, CA 93710', languages: ['Hindi', 'Spanish'], npi: '1679657043', specialty: 'Pediatrics', lat: 36.835099, lng: -119.731432},
        {address: '6769 N WILLOW AVE, FRESNO, CA 93710', languages: ['Hindi', 'Spanish'], npi: '1679657043', specialty: 'Pediatrics', lat: 36.835099, lng: -119.731432},
        {address: '5088 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1437256211', specialty: 'Pediatrics', lat: 36.810139, lng: -119.781007},
        {address: '5088 N FRESNO ST, FRESNO, CA 93710', languages: [], npi: '1437256211', specialty: 'Pediatrics', lat: 36.810139, lng: -119.781007},
        {address: '5066 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1831154673', specialty: 'Internal Medicine', lat: 36.809778, lng: -119.7808},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1386914067', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1386914067', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1942326517', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1942326517', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1942326517', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568413755', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568413755', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568413755', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568413755', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1699950063', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1831207976', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1831207976', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922025857', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922025857', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1033319199', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1033319199', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1417194234', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1821284449', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Farsi'], npi: '1194987297', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Farsi'], npi: '1194987297', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1386824043', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1386824043', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1386824043', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437108131', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1518152867', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1023218419', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1023218419', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1023218419', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1023218419', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1366685067', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1366685067', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588850879', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588850879', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588850879', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922083724', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922083724', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922083724', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1922083724', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1568661296', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1538391271', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1538391271', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588673024', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588673024', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588673024', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1588673024', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1124075551', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Spanish'], npi: '1124075551', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi'], npi: '1003022682', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi'], npi: '1972729093', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi'], npi: '1972729093', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi'], npi: '1972729093', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi'], npi: '1972729093', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1700029204', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1477868412', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1477868412', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1477868412', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1548269707', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1548269707', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1548269707', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1548269707', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1437261005', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1841300050', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1508819152', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1235291758', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1235291758', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1235291758', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1235291758', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1528269602', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi', 'Telugu'], npi: '1457544579', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: ['Hindi', 'Telugu'], npi: '1457544579', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1205045390', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1275535627', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1275535627', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1275535627', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1275535627', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1063527463', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1063527463', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1063527463', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1180 E SHAW AVE, FRESNO, CA 93710', languages: [], npi: '1063527463', specialty: 'Internal Medicine', lat: 36.809799, lng: -119.768167},
        {address: '1095 E SHAW AVE, FRESNO, CA 93710', languages: ['Armenian', 'Russian'], npi: '1366459075', specialty: 'General Practice', lat: 36.808137, lng: -119.769814},
        {address: '5479 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1346263225', specialty: 'Pediatrics', lat: 36.81748, lng: -119.782123},
        {address: '5680 N FRESNO ST, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi', 'Panjabi'], npi: '1346203973', specialty: 'Internal Medicine', lat: 36.821883, lng: -119.764561},
        {address: '5680 N FRESNO ST, FRESNO, CA 93710', languages: ['Gujarati', 'Hindi', 'Panjabi'], npi: '1346203973', specialty: 'Internal Medicine', lat: 36.821883, lng: -119.764561},
        {address: '6181 N THESTA ST, FRESNO, CA 93710', languages: [], npi: '1740290709', specialty: 'Obstetrics/Gynecology', lat: 36.826196, lng: -119.783354},
        {address: '6181 N THESTA ST, FRESNO, CA 93710', languages: [], npi: '1740290709', specialty: 'Obstetrics/Gynecology', lat: 36.826196, lng: -119.783354},
        {address: '6137 N THESTA ST, FRESNO, CA 93710', languages: ['French', 'Russian', 'Spanish'], npi: '1154353050', specialty: 'Family Practice', lat: 36.825605, lng: -119.783358},
        {address: '6137 N THESTA ST, FRESNO, CA 93710', languages: ['French', 'Russian', 'Spanish'], npi: '1154353050', specialty: 'Family Practice', lat: 36.825605, lng: -119.783358},
        {address: '6137 N THESTA ST, FRESNO, CA 93710', languages: ['French', 'Russian', 'Spanish'], npi: '1154353050', specialty: 'Family Practice', lat: 36.825605, lng: -119.783358},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi'], npi: '1831167899', specialty: 'Obstetrics/Gynecology', lat: 36.826409, lng: -119.782602},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi'], npi: '1831167899', specialty: 'Obstetrics/Gynecology', lat: 36.826409, lng: -119.782602},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi'], npi: '1831167899', specialty: 'Obstetrics/Gynecology', lat: 36.826409, lng: -119.782602},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Hindi'], npi: '1831167899', specialty: 'Obstetrics/Gynecology', lat: 36.826409, lng: -119.782602},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Japanese', 'Spanish'], npi: '1689674632', specialty: 'General Practice', lat: 36.826409, lng: -119.782602},
        {address: '6183 N FRESNO ST, FRESNO, CA 93710', languages: ['Laotian', 'Lettish', 'Spanish'], npi: '1356321384', specialty: 'Family Practice', lat: 36.826409, lng: -119.782602},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942},
        {address: '6191 N FRESNO ST, FRESNO, CA 93710', languages: ['Spanish'], npi: '1689772261', specialty: 'Family Practice', lat: 36.826379, lng: -119.781942}],
    serviceAreaIds: ['ca_fresno_93204', 'ca_fresno_93210', 'ca_fresno_93230', 'ca_fresno_93234', 'ca_fresno_93242', 'ca_fresno_93266', 'ca_fresno_93451', 'ca_fresno_93602', 'ca_fresno_93603', 'ca_fresno_93605', 'ca_fresno_93606', 'ca_fresno_93607', 'ca_fresno_93608', 'ca_fresno_93609', 'ca_fresno_93611', 'ca_fresno_93612', 'ca_fresno_93613', 'ca_fresno_93616', 'ca_fresno_93618', 'ca_fresno_93619', 'ca_fresno_93620', 'ca_fresno_93621', 'ca_fresno_93622', 'ca_fresno_93624', 'ca_fresno_93625', 'ca_fresno_93626', 'ca_fresno_93627', 'ca_fresno_93628', 'ca_fresno_93630', 'ca_fresno_93631', 'ca_fresno_93634', 'ca_fresno_93640', 'ca_fresno_93641', 'ca_fresno_93644', 'ca_fresno_93646', 'ca_fresno_93647', 'ca_fresno_93648', 'ca_fresno_93649', 'ca_fresno_93650', 'ca_fresno_93651', 'ca_fresno_93652', 'ca_fresno_93654', 'ca_fresno_93656', 'ca_fresno_93657', 'ca_fresno_93660', 'ca_fresno_93662', 'ca_fresno_93664', 'ca_fresno_93667', 'ca_fresno_93668', 'ca_fresno_93675', 'ca_fresno_93701', 'ca_fresno_93702', 'ca_fresno_93703', 'ca_fresno_93704', 'ca_fresno_93705', 'ca_fresno_93706', 'ca_fresno_93707', 'ca_fresno_93708', 'ca_fresno_93709', 'ca_fresno_93710', 'ca_fresno_93711', 'ca_fresno_93712', 'ca_fresno_93714', 'ca_fresno_93715', 'ca_fresno_93716', 'ca_fresno_93717', 'ca_fresno_93718', 'ca_fresno_93720', 'ca_fresno_93721', 'ca_fresno_93722', 'ca_fresno_93723', 'ca_fresno_93725', 'ca_fresno_93726', 'ca_fresno_93727', 'ca_fresno_93728', 'ca_fresno_93729', 'ca_fresno_93730', 'ca_fresno_93737', 'ca_fresno_93744', 'ca_fresno_93745', 'ca_fresno_93747', 'ca_fresno_93755', 'ca_fresno_93771', 'ca_fresno_93772', 'ca_fresno_93773', 'ca_fresno_93774', 'ca_fresno_93775', 'ca_fresno_93776', 'ca_fresno_93777', 'ca_fresno_93778', 'ca_fresno_93779', 'ca_fresno_93790', 'ca_fresno_93791', 'ca_fresno_93792', 'ca_fresno_93793', 'ca_fresno_93794', 'ca_fresno_95043']
  },
  {
    dataSources: [
        'Mississippi',
        '2018 Ambetter of Magnolia Oncologists'
    ],
    description: '2018 Ambetter of Magnolia - Oncologists',
    name: 'Mississipi Oncologists Ambetter',
    providers: [
        {
            address: '1203 Jefferson Street, Laurel, MS 39440',
            languages: [],
            npi: '1083920425',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.68604,
            lng: -89.141349
        },
        {
            address: '1514 E Union Street, Greenville, MS 38703',
            languages: [],
            npi: '1972577930',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.409772,
            lng: -91.034358
        },
        {
            address: '581 Medical Drive, Clarksdale, MS 38614',
            languages: [],
            npi: '1972577930',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.207458,
            lng: -90.544845
        },
        {
            address: '818 East Sunflower, Cleveland, MS 38732',
            languages: [],
            npi: '1972577930',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.747221,
            lng: -90.710696
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1437156197',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1437156197',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1437156197',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1437156197',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '7601 Southcrest Parkway, Southaven, MS 38671',
            languages: [],
            npi: '1255323663',
            specialty: 'Radiology: Radiation Oncology',
            lat: 34.970276,
            lng: -89.998335
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '960 J K Avent Drive, Grenada, MS 38901',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.786016,
            lng: -89.845462
        },
        {
            address: '960 J K Avent Drive, Grenada, MS 38901',
            languages: [],
            npi: '1699776518',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.786016,
            lng: -89.845462
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1558458695',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1013173590',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '301 South 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1013173590',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1588699839',
            specialty: 'Radiology: Radiation Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '301 South 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1417275652',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '1225 North State Street, Jackson, MS 39202',
            languages: [],
            npi: '1225325699',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.313986,
            lng: -90.17822
        },
        {
            address: '1850 Chadwick Drive, Jackson, MS 39204',
            languages: [],
            npi: '1225325699',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.286654,
            lng: -90.253805
        },
        {
            address: '969 Lakeland Drive, Jackson, MS 39216',
            languages: [],
            npi: '1225325699',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.333686,
            lng: -90.166832
        },
        {
            address: '1200 Office Park Drive, Oxford, MS 38655',
            languages: [],
            npi: '1073735114',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 34.330814,
            lng: -89.483519
        },
        {
            address: '15012 Lemoyne Boulevard, Biloxi, MS 39532',
            languages: [],
            npi: '1073735114',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 30.443261,
            lng: -88.859079
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1073735114',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '7731 Old Canton Road, Madison, MS 39110',
            languages: [],
            npi: '1073735114',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.461069,
            lng: -90.106988
        },
        {
            address: '840 North Oak Avenue, Ruleville, MS 38771',
            languages: [],
            npi: '1073735114',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 33.734303,
            lng: -90.546636
        },
        {
            address: '611 Alcorn Drive, Corinth, MS 38834',
            languages: [],
            npi: '1346460367',
            specialty: 'Radiology: Radiation Oncology',
            lat: 34.934451,
            lng: -88.55848
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1770870289',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1770870289',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1770870289',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1013132406',
            specialty: 'Surgery: Surgical Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1477557064',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1477557064',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1477557064',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1477557064',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7601 Southcrest Parkway, Southaven, MS 38671',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.970276,
            lng: -89.998335
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1467670984',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1336176817',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2100 Highway 61 N, Vicksburg, MS 39183',
            languages: [],
            npi: '1306043278',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.374656,
            lng: -90.827333
        },
        {
            address: '2124 14th Street, Meridian, MS 39301',
            languages: [],
            npi: '1306043278',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.370942,
            lng: -88.699608
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1831181247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1514 E Union Street, Greenville, MS 38703',
            languages: [],
            npi: '1699777854',
            specialty: 'Radiology: Radiation Oncology',
            lat: 33.409772,
            lng: -91.034358
        },
        {
            address: '104 Doctors Park, Starkville, MS 39759',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.475057,
            lng: -88.81807
        },
        {
            address: '104 Doctors Park, Starkville, MS 39759',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.475057,
            lng: -88.81807
        },
        {
            address: '2520 5th Street North, Columbus, MS 39703',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.501496,
            lng: -88.40174
        },
        {
            address: '2520 5th Street North, Columbus, MS 39703',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.501496,
            lng: -88.40174
        },
        {
            address: '2520 Fifth Street North, Columbus, MS 39705',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.525649,
            lng: -88.42906
        },
        {
            address: '2520 Fifth Street North, Columbus, MS 39705',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.525649,
            lng: -88.42906
        },
        {
            address: '255 Baptist Boulevard, Columbus, MS 39705',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.523633,
            lng: -88.423432
        },
        {
            address: '255 Baptist Boulevard, Columbus, MS 39705',
            languages: [],
            npi: '1215960786',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.523633,
            lng: -88.423432
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1417153263',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1417153263',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1417153263',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1417153263',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '133 Jefferson Davis Boulevard, Natchez, MS 39120',
            languages: [],
            npi: '1558422576',
            specialty: 'Radiology: Radiation Oncology',
            lat: 31.563475,
            lng: -91.403938
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1164719597',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2500 North State Street, Jackson, MS 39216',
            languages: [],
            npi: '1164719597',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1538460225',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1538460225',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1538460225',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1538460225',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1477595643',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1477595643',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '415 South 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1477595643',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.3185,
            lng: -89.331433
        },
        {
            address: '415 South 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1477595643',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 31.3185,
            lng: -89.331433
        },
        {
            address: '1514 E Union Street, Greenville, MS 38703',
            languages: [],
            npi: '1922072891',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.409772,
            lng: -91.034358
        },
        {
            address: '1514 E Union Street, Greenville, MS 38703',
            languages: [],
            npi: '1922072891',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.409772,
            lng: -91.034358
        },
        {
            address: '581 Medical Drive, Clarksdale, MS 38614',
            languages: [],
            npi: '1922072891',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.207458,
            lng: -90.544845
        },
        {
            address: '581 Medical Drive, Clarksdale, MS 38614',
            languages: [],
            npi: '1922072891',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.207458,
            lng: -90.544845
        },
        {
            address: '147 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1700071008',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.396651,
            lng: -88.890696
        },
        {
            address: '147 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1700071008',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.396651,
            lng: -88.890696
        },
        {
            address: '150 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1700071008',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.398973,
            lng: -88.890367
        },
        {
            address: '150 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1700071008',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.398973,
            lng: -88.890367
        },
        {
            address: '1501 Aston Avenue, McComb, MS 39648',
            languages: [],
            npi: '1326048356',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 31.250789,
            lng: -90.4711
        },
        {
            address: '1501 Aston Avenue, McComb, MS 39648',
            languages: [],
            npi: '1326048356',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.250789,
            lng: -90.4711
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1518178524',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1134238496',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1538322011',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2969 Curran Drive North, Jackson, MS 39216',
            languages: [],
            npi: '1497757603',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.333861,
            lng: -90.159551
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1235347477',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1821235474',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1821235474',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1932381530',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1043257173',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1265428676',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1669464012',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1669464012',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '2819 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.373513,
            lng: -88.534377
        },
        {
            address: '2819 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.373513,
            lng: -88.534377
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1063628808',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '2100 Highway 61 N Bypass, Vicksburg, MS 39183',
            languages: [],
            npi: '1104821123',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.374656,
            lng: -90.827333
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1609188911',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1609188911',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1215100011',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1497713267',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1225 North State Street, Jackson, MS 39202',
            languages: [],
            npi: '1861442436',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.313986,
            lng: -90.17822
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1619975521',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1619975521',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1992892020',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '1850 Chadwick Drive, Jackson, MS 39204',
            languages: [],
            npi: '1518969724',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.286654,
            lng: -90.253805
        },
        {
            address: '969 Lakeland Drive, Jackson, MS 39216',
            languages: [],
            npi: '1487659850',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.333686,
            lng: -90.166832
        },
        {
            address: '906 Sixth Street, Picayune, MS 39466',
            languages: [],
            npi: '1043375363',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.52547,
            lng: -89.67951
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1285711978',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1285711978',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '57 Dewey Street, Lucedale, MS 39452',
            languages: [],
            npi: '1285711978',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.921657,
            lng: -88.592645
        },
        {
            address: '104 Doctors Park, Starkville, MS 39759',
            languages: [],
            npi: '1730229816',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.475057,
            lng: -88.81807
        },
        {
            address: '104 Doctors Park, Starkville, MS 39759',
            languages: [],
            npi: '1730229816',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.475057,
            lng: -88.81807
        },
        {
            address: '2520 Fifth Street North, Columbus, MS 39705',
            languages: [],
            npi: '1730229816',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.525649,
            lng: -88.42906
        },
        {
            address: '2520 Fifth Street North, Columbus, MS 39705',
            languages: [],
            npi: '1730229816',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.525649,
            lng: -88.42906
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1003819269',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1200 Office Park Drive, Oxford, MS 38655',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 34.330814,
            lng: -89.483519
        },
        {
            address: '1410 E Woodrow Wilson Avenue, Jackson, MS 39216',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.326573,
            lng: -90.165857
        },
        {
            address: '15012 Lemoyne Boulevard, Biloxi, MS 39532',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 30.443261,
            lng: -88.859079
        },
        {
            address: '2500 North State Street, Jackson, MS 39216',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '7731 Old Canton Road, Madison, MS 39110',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.461069,
            lng: -90.106988
        },
        {
            address: '840 North Oak Avenue, Ruleville, MS 38771',
            languages: [],
            npi: '1679740906',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 33.734303,
            lng: -90.546636
        },
        {
            address: '1203 Jefferson Street, Laurel, MS 39440',
            languages: [],
            npi: '1700890498',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.68604,
            lng: -89.141349
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1013911668',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '1704 23rd Avenue, Meridian, MS 39301',
            languages: [],
            npi: '1992782924',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.374286,
            lng: -88.701179
        },
        {
            address: '1001 Holland Avenue, Philadelphia, MS 39350',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.752693,
            lng: -89.100354
        },
        {
            address: '1001 Holland Avenue, Philadelphia, MS 39350',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.752693,
            lng: -89.100354
        },
        {
            address: '2124 14th Street, Meridian, MS 39301',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.370942,
            lng: -88.699608
        },
        {
            address: '2124 14th Street, Meridian, MS 39301',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.370942,
            lng: -88.699608
        },
        {
            address: '213 East Hospital Road, Philadelphia, MS 39350',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.757806,
            lng: -89.108922
        },
        {
            address: '213 East Hospital Road, Philadelphia, MS 39350',
            languages: [],
            npi: '1568449536',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.757806,
            lng: -89.108922
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1164450904',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1124241062',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1578723276',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1841636966',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2012 Highway 90, Gautier, MS 39553',
            languages: [],
            npi: '1538189543',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.390861,
            lng: -88.643601
        },
        {
            address: '2809 Denny Avenue, Pascagoula, MS 39581',
            languages: [],
            npi: '1538189543',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.373575,
            lng: -88.534292
        },
        {
            address: '3535 Bienville Boulevard, Ocean Springs, MS 39564',
            languages: [],
            npi: '1538189543',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.411466,
            lng: -88.772663
        },
        {
            address: '1207 Highway 182 W, Starkville, MS 39759',
            languages: [],
            npi: '1417248501',
            specialty: 'Radiology: Radiation Oncology',
            lat: 33.462432,
            lng: -88.895115
        },
        {
            address: '990 South Madison Street, Tupelo, MS 38801',
            languages: [],
            npi: '1417248501',
            specialty: 'Radiology: Radiation Oncology',
            lat: 34.23934,
            lng: -88.712801
        },
        {
            address: '1225 North State Street, Jackson, MS 39202',
            languages: [],
            npi: '1821291790',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.313986,
            lng: -90.17822
        },
        {
            address: '100 South Magnolia Street, Edwards, MS 39066',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.332218,
            lng: -90.605302
        },
        {
            address: '1203 Mission Park Drive, Vicksburg, MS 39180',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.340945,
            lng: -90.862434
        },
        {
            address: '129 White Oak Street, Utica, MS 39175',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.107585,
            lng: -90.622699
        },
        {
            address: '145 Raymond Road, Jackson, MS 39204',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.282781,
            lng: -90.211357
        },
        {
            address: '1655 Whiting Road, Jackson, MS 39209',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.30084,
            lng: -90.265835
        },
        {
            address: '1716 Isabel Street, Jackson, MS 39204',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.292208,
            lng: -90.218409
        },
        {
            address: '1860 Chadwick Drive, Jackson, MS 39204',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.28714,
            lng: -90.258062
        },
        {
            address: '2009 Byram Bulldog Boulevard, Vicksburg, MS 39180',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.339533,
            lng: -90.834407
        },
        {
            address: '2185 Fortune Street, Jackson, MS 39204',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.290258,
            lng: -90.219986
        },
        {
            address: '260 Highway 18, Utica, MS 39175',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.116985,
            lng: -90.600021
        },
        {
            address: '327 South Gallatin Street, Jackson, MS 39203',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.305466,
            lng: -90.192934
        },
        {
            address: '350 W Woodrow Wilson Boulevard, Jackson, MS 39213',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.32694,
            lng: -90.194933
        },
        {
            address: '3502 W Northside, Jackson, MS 39213',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.355633,
            lng: -90.155709
        },
        {
            address: '3502 W Northside Drive, Jackson, MS 39213',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.355633,
            lng: -90.155709
        },
        {
            address: '514 A-B East Woodrow Wilson Boulevard, Jackson, MS 39216',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.333861,
            lng: -90.159551
        },
        {
            address: '550 Caldwell Drive, Hazlehurst, MS 39083',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 31.871032,
            lng: -90.397487
        },
        {
            address: '9700 I 20 Frontage Road, Bolton, MS 39041',
            languages: [],
            npi: '1598709354',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.351742,
            lng: -90.394646
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1356380851',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1043262777',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1639119589',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '1225 North State Street, Jackson, MS 39202',
            languages: [],
            npi: '1013919216',
            specialty: 'Radiology: Radiation Oncology',
            lat: 32.313986,
            lng: -90.17822
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1053303750',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1203 Jefferson Street, Laurel, MS 39440',
            languages: [],
            npi: '1447690854',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.68604,
            lng: -89.141349
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1205831666',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '2969 North Curran Drive, Jackson, MS 39216',
            languages: [],
            npi: '1205831666',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.333861,
            lng: -90.159551
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1790780716',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1851399638',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '301 S 28th Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: '1730192907',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.320942,
            lng: -89.33129
        },
        {
            address: '303 Medical Center Drive, Batesville, MS 38606',
            languages: [],
            npi: '1912091109',
            specialty: 'Radiology: Radiation Oncology',
            lat: 34.302966,
            lng: -89.91703
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1417900374',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1245212844',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '1227 N State, Jackson, MS 39202',
            languages: [],
            npi: '1912901513',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.314136,
            lng: -90.17822
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1639481856',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '200 Highway 30 West, New Albany, MS 38652',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.498566,
            lng: -89.027913
        },
        {
            address: '200 Highway 30 West, New Albany, MS 38652',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.498566,
            lng: -89.027913
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1558365205',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1225020613',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1225020613',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1225020613',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1225020613',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1704 23rd Avenue, Meridian, MS 39301',
            languages: [],
            npi: '1780793059',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.374286,
            lng: -88.701179
        },
        {
            address: '1135 Ocean Springs Road, Ocean Springs, MS 39564',
            languages: [],
            npi: '1508838681',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.414014,
            lng: -88.779366
        },
        {
            address: '1135 Ocean Springs Road, Ocean Springs, MS 39564',
            languages: [],
            npi: '1508838681',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.414014,
            lng: -88.779366
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1770581662',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2500 North State Street, Jackson, MS 39216',
            languages: [],
            npi: '1114188471',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '960 J K Avent Drive, Grenada, MS 38901',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.786016,
            lng: -89.845462
        },
        {
            address: '960 J K Avent Drive, Grenada, MS 38901',
            languages: [],
            npi: '1922203082',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.786016,
            lng: -89.845462
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1619198512',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1598762247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1598762247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1598762247',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1598762247',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1427055185',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '1205 Highway 182 West, Starkville, MS 39759',
            languages: [],
            npi: '1427055185',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.462388,
            lng: -88.894963
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1427055185',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1427055185',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.238436,
            lng: -88.718351
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: '1124225313',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2500 North State Street, Jackson, MS 39216',
            languages: [],
            npi: '1124225313',
            specialty: 'Pediatrics: Pediatric Hematology-Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '147 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.396651,
            lng: -88.890696
        },
        {
            address: '147 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.396651,
            lng: -88.890696
        },
        {
            address: '150 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.398973,
            lng: -88.890367
        },
        {
            address: '150 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.398973,
            lng: -88.890367
        },
        {
            address: '15200 Community Road, Gulfport, MS 39503',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 30.443664,
            lng: -89.093366
        },
        {
            address: '15200 Community Road, Gulfport, MS 39503',
            languages: [],
            npi: '1689817041',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 30.443664,
            lng: -89.093366
        },
        {
            address: '215 Marion Avenue, McComb, MS 39648',
            languages: [],
            npi: '1689850620',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 31.252059,
            lng: -90.472609
        },
        {
            address: '333 Highway 82 West, Greenwood, MS 38930',
            languages: [],
            npi: '1871607598',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 33.503848,
            lng: -90.182597
        },
        {
            address: '333 Highway 82 West, Greenwood, MS 38930',
            languages: [],
            npi: '1871607598',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.503848,
            lng: -90.182597
        },
        {
            address: '1300 Sunset Drive, Grenada, MS 38901',
            languages: [],
            npi: '1164731931',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.769177,
            lng: -89.813372
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1164731931',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '960 J K Avent Drive, Grenada, MS 38901',
            languages: [],
            npi: '1164731931',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 33.786016,
            lng: -89.845462
        },
        {
            address: '2969 North Curran Drive, Jackson, MS 39216',
            languages: [],
            npi: '1639380207',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 32.333861,
            lng: -90.159551
        },
        {
            address: '2969 North Curran Drive, Jackson, MS 39216',
            languages: [],
            npi: '1639380207',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 32.333861,
            lng: -90.159551
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '2301 South Lamar Boulevard, Oxford, MS 38655',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.34772,
            lng: -89.521073
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '391 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.967455,
            lng: -89.998223
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '504 Azalea Drive, Oxford, MS 38655',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.335688,
            lng: -89.521849
        },
        {
            address: '7601 Southcrest Parkway, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.970276,
            lng: -89.998335
        },
        {
            address: '7601 Southcrest Parkway, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.970276,
            lng: -89.998335
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Medical Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '7900 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: '1982602785',
            specialty: 'Internal Medicine: Hematology & Oncology',
            lat: 34.975601,
            lng: -89.98913
        },
        {
            address: '2500 North State Street, Jackson, MS 39216',
            languages: [],
            npi: '1194717363',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '961 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: '1255313193',
            specialty: 'Obstetrics & Gynecology: Gynecologic Oncology',
            lat: 34.238436,
            lng: -88.718351
        }
    ],
    serviceAreaIds: MississippiServiceAreas
  },
  {
    dataSources: [
        'all_ms_counties.csv',
        '2018 Ambetter of Magnolia_Endocrinologists.csv'
    ],
    description: '2018 Ambetter of Magnolia - Endocrinologists',
    name: 'Mississipi Endocrinologists Ambetter',
    providers: [
        {
            address: '511 West Laurel Avenue, Hattiesburg, MS 39401',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 31.323062,
            lng: -89.291405
        },
        {
            address: '5909 Highway 49 S, Hattiesburg, MS 39402',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 31.351179,
            lng: -89.339788
        },
        {
            address: '5909 US Highway 49, Hattiesburg, MS 39402',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 31.351179,
            lng: -89.339788
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '5909 US Highway 49, Hattiesburg, MS 39402',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 31.351179,
            lng: -89.339788
        },
        {
            address: '147 Reynoir Street, Biloxi, MS 39530',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 30.396651,
            lng: -88.890696
        },
        {
            address: '970 Tommy Munro Drive, Biloxi, MS 39532',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 30.445456,
            lng: -88.939747
        },
        {
            address: '5909 Highway 49, Hattiesburg, MS 39402',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 31.351179,
            lng: -89.339788
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '618 Blue Meadow Road, Bay St Louis, MS 39520',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 30.317296,
            lng: -89.346909
        },
        {
            address: '801 Williams Avenue, Picayune, MS 39466',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 30.528797,
            lng: -89.688441
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '401 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.967618,
            lng: -89.9989
        },
        {
            address: '7736 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.975003,
            lng: -89.989273
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2610 Courthouse Circle, Flowood, MS 39232',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328358,
            lng: -90.114722
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '401 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.967618,
            lng: -89.9989
        },
        {
            address: '1200 N State Street, Jackson, MS 39202',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.313836,
            lng: -90.17822
        },
        {
            address: '1009 City Avenue N, Ripley, MS 38663',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.739196,
            lng: -88.949648
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '401 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.967618,
            lng: -89.9989
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '4566 South Eason Boulevard, Tupelo, MS 38801',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.257847,
            lng: -88.656317
        },
        {
            address: '1200 Office Park Drive, Oxford, MS 38655',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.330814,
            lng: -89.483519
        },
        {
            address: '15012 Lemoyne Boulevard, Biloxi, MS 39532',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 30.443261,
            lng: -88.859079
        },
        {
            address: '4428 South Eason Boulevard, Tupelo, MS 38801',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.256841,
            lng: -88.656277
        },
        {
            address: '7731 Old Canton Road, Madison, MS 39110',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.461069,
            lng: -90.106988
        },
        {
            address: '830 South Gloster Street, Tupelo, MS 38801',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.2416,
            lng: -88.717709
        },
        {
            address: '840 North Oak Avenue, Ruleville, MS 38771',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 33.734303,
            lng: -90.546636
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        },
        {
            address: '401 Southcrest Circle, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.967618,
            lng: -89.9989
        },
        {
            address: '7736 Airways Boulevard, Southaven, MS 38671',
            languages: [],
            npi: 'null',
            specialty: 'Pediatrics: Pediatric Endocrinology',
            lat: 34.975003,
            lng: -89.989273
        },
        {
            address: '3704 Highway 72 West, Corinth, MS 38834',
            languages: [],
            npi: 'null',
            specialty: 'Internal Medicine: Endocrinology, Diabetes & Metabolism',
            lat: 34.931072,
            lng: -88.564429
        },
        {
            address: '2500 N State Street, Jackson, MS 39216',
            languages: [],
            npi: 'null',
            specialty: 'Obstetrics & Gynecology: Reproductive Endocrinology',
            lat: 32.328566,
            lng: -90.175626
        }
    ],
    serviceAreaIds: MississippiServiceAreas
  }
]
