<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Proje Ekle</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-select
          item-text="yontemAdi"
          placeholder="Bir jeofizik yöntem seçiniz"
          :items="methodSubmethod"
          single-line
          @change="handleChange"
        >
        </v-select>
        <v-select
          v-if="fillSubMethod.length"
          item-text="altYontemler"
          :items="fillSubMethod"
          placeholder="Bir alt yöntem seçiniz"
          single-line
        ></v-select>

        <v-select
          item-text="il"
          :items="cities"
          single-line
          placeholder="İl Seçiniz"
          @change="handleCityChange"
        ></v-select>

        <v-select
          v-if="fillDistrict.length"
          item-text="ilceleri"
          :items="fillDistrict"
          single-line
          placeholder="İlçe seçiniz"
        ></v-select>

        <v-text-field
          v-model="tutorial.title"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="Nokta Adı"
          required
        ></v-text-field>

        <!-- <v-text-field
          v-model="tutorial.description"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="İl"
          required
        ></v-text-field>

        <v-text-field
          v-model="tutorial.details"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="İlçe"
          required
        ></v-text-field> -->
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Çalışma Tarihi"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            :active-picker.sync="activePicker"
            :max="
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10)
            "
            min="1950-01-01"
            locale="tr"
            @change="save"
          ></v-date-picker>
        </v-menu>
      </v-form>

      <v-btn color="primary" class="mt-3" @click="saveTutorial">Kaydet</v-btn>

      <div class="mt-3">
        <label for="formFile" class="form-label"
          >Yuklemek için bir Excel dosyası seçin.</label
        >
        <input
          class="form-control"
          type="file"
          id="formFile"
          @change="importExcel"
          accept=".csv"
        />
      </div>
      <div class="mt-3" v-show="show">
        {{ message }}
      </div>
      <!-- <input type="file" @change="importExcel" accept=".csv" /> -->

      <v-btn color="primary" class="mt-3" @click="dataImporter"
        >Excel Import</v-btn
      >
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title> Proje(ler) Başarıyla Eklendi! </v-card-title>

        <v-card-subtitle>
          Yeni bir proje eklemek için 'Ekle' butonuna basın.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newTutorial">Ekle</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
import xlsx from "xlsx";
export default {
  name: "add-tutorial",
  data() {
    return {
      tutorial: {
        id: null,
        title: "",
        description: "",
        details: "",
        published: false,
      },
      methodSubmethod: [
        {
          yontemAdi: "Potansiyel Alan Yöntemleri",
          altYontemler: ["Gravite", "Manyetik", "Radyometri", "Süseptibilite"],
        },
        {
          yontemAdi: "Elektrik ve Elektromanyetik Yöntemler",
          altYontemler: [
            "Düşey Elektrik Sondajı (DES)",
            "Geçici Elektromanyetik Yöntem (TEM)",
            "Yapay Uçlaşma Yöntemi (IP)",
            "Gradient Yapay Uçlaşma Yöntemi (IP)",
            "Manyetotellürik (MT)",
            "Audio Manyetotellürik (AMT)",
            "Yapay Kaynaklı Audio Manyetotellürik (CSAMT)",
            "Doğal Potansiyel (SP)",
            "Çok Kanallı Özdirenç Yöntemi",
          ],
        },
        {
          yontemAdi: "Sismik Yöntemler",
          altYontemler: ["2 Boyutlu Sismik Yansıma", "Yer Radarı"],
        },
        {
          yontemAdi: "Kuyu Ölçüleri",
          altYontemler: [
            "Gamma Ray (GR)",
            "Neutron (NEU)",
            "Density (DEN)",
            "Resistivity (RES)",
            "Self Potential (SP)",
            "Caliper (CAL)",
            "Sıcaklık Logu (TERM)",
            "Spektral Gamma Ray (SGR)",
            "Çimento Logu (CBL)",
            "Sonic Log (SON)",
            "Casing Collor Locator (CCL)",
            "Birleşik Log",
          ],
        },
      ],
      cities: [
        {
          il: "Adana",
          plaka: 1,
          ilceleri: [
            "Aladağ",
            "Ceyhan",
            "Çukurova",
            "Feke",
            "İmamoğlu",
            "Karaisalı",
            "Karataş",
            "Kozan",
            "Pozantı",
            "Saimbeyli",
            "Sarıçam",
            "Seyhan",
            "Tufanbeyli",
            "Yumurtalık",
            "Yüreğir",
          ],
        },
        {
          il: "Adıyaman",
          plaka: 2,
          ilceleri: [
            "Besni",
            "Çelikhan",
            "Gerger",
            "Gölbaşı",
            "Kahta",
            "Merkez",
            "Samsat",
            "Sincik",
            "Tut",
          ],
        },
        {
          il: "Afyonkarahisar",
          plaka: 3,
          ilceleri: [
            "Başmakçı",
            "Bayat",
            "Bolvadin",
            "Çay",
            "Çobanlar",
            "Dazkırı",
            "Dinar",
            "Emirdağ",
            "Evciler",
            "Hocalar",
            "İhsaniye",
            "İscehisar",
            "Kızılören",
            "Merkez",
            "Sandıklı",
            "Sinanpaşa",
            "Sultandağı",
            "Şuhut",
          ],
        },
        {
          il: "Ağrı",
          plaka: 4,
          ilceleri: [
            "Diyadin",
            "Doğubayazıt",
            "Eleşkirt",
            "Hamur",
            "Merkez",
            "Patnos",
            "Taşlıçay",
            "Tutak",
          ],
        },
        {
          il: "Amasya",
          plaka: 5,
          ilceleri: [
            "Göynücek",
            "Gümüşhacıköy",
            "Hamamözü",
            "Merkez",
            "Merzifon",
            "Suluova",
            "Taşova",
          ],
        },
        {
          il: "Ankara",
          plaka: 6,
          ilceleri: [
            "Altındağ",
            "Ayaş",
            "Bala",
            "Beypazarı",
            "Çamlıdere",
            "Çankaya",
            "Çubuk",
            "Elmadağ",
            "Güdül",
            "Haymana",
            "Kalecik",
            "Kızılcahamam",
            "Nallıhan",
            "Polatlı",
            "Şereflikoçhisar",
            "Yenimahalle",
            "Gölbaşı",
            "Keçiören",
            "Mamak",
            "Sincan",
            "Kazan",
            "Akyurt",
            "Etimesgut",
            "Evren",
            "Pursaklar",
          ],
        },
        {
          il: "Antalya",
          plaka: 7,
          ilceleri: [
            "Akseki",
            "Alanya",
            "Elmalı",
            "Finike",
            "Gazipaşa",
            "Gündoğmuş",
            "Kaş",
            "Korkuteli",
            "Kumluca",
            "Manavgat",
            "Serik",
            "Demre",
            "İbradı",
            "Kemer",
            "Aksu",
            "Döşemealtı",
            "Kepez",
            "Konyaaltı",
            "Muratpaşa",
          ],
        },
        {
          il: "Artvin",
          plaka: 8,
          ilceleri: [
            "Ardanuç",
            "Arhavi",
            "Merkez",
            "Borçka",
            "Hopa",
            "Şavşat",
            "Yusufeli",
            "Murgul",
          ],
        },
        {
          il: "Aydın",
          plaka: 9,
          ilceleri: [
            "Merkez",
            "Bozdoğan",
            "Efeler",
            "Çine",
            "Germencik",
            "Karacasu",
            "Koçarlı",
            "Kuşadası",
            "Kuyucak",
            "Nazilli",
            "Söke",
            "Sultanhisar",
            "Yenipazar",
            "Buharkent",
            "İncirliova",
            "Karpuzlu",
            "Köşk",
            "Didim",
          ],
        },
        {
          il: "Balıkesir",
          plaka: 10,
          ilceleri: [
            "Altıeylül",
            "Ayvalık",
            "Merkez",
            "Balya",
            "Bandırma",
            "Bigadiç",
            "Burhaniye",
            "Dursunbey",
            "Edremit",
            "Erdek",
            "Gönen",
            "Havran",
            "İvrindi",
            "Karesi",
            "Kepsut",
            "Manyas",
            "Savaştepe",
            "Sındırgı",
            "Gömeç",
            "Susurluk",
            "Marmara",
          ],
        },
        {
          il: "Bilecik",
          plaka: 11,
          ilceleri: [
            "Merkez",
            "Bozüyük",
            "Gölpazarı",
            "Osmaneli",
            "Pazaryeri",
            "Söğüt",
            "Yenipazar",
            "İnhisar",
          ],
        },
        {
          il: "Bingöl",
          plaka: 12,
          ilceleri: [
            "Merkez",
            "Genç",
            "Karlıova",
            "Kiğı",
            "Solhan",
            "Adaklı",
            "Yayladere",
            "Yedisu",
          ],
        },
        {
          il: "Bitlis",
          plaka: 13,
          ilceleri: [
            "Adilcevaz",
            "Ahlat",
            "Merkez",
            "Hizan",
            "Mutki",
            "Tatvan",
            "Güroymak",
          ],
        },
        {
          il: "Bolu",
          plaka: 14,
          ilceleri: [
            "Merkez",
            "Gerede",
            "Göynük",
            "Kıbrıscık",
            "Mengen",
            "Mudurnu",
            "Seben",
            "Dörtdivan",
            "Yeniçağa",
          ],
        },
        {
          il: "Burdur",
          plaka: 15,
          ilceleri: [
            "Ağlasun",
            "Bucak",
            "Merkez",
            "Gölhisar",
            "Tefenni",
            "Yeşilova",
            "Karamanlı",
            "Kemer",
            "Altınyayla",
            "Çavdır",
            "Çeltikçi",
          ],
        },
        {
          il: "Bursa",
          plaka: 16,
          ilceleri: [
            "Gemlik",
            "İnegöl",
            "İznik",
            "Karacabey",
            "Keles",
            "Mudanya",
            "Mustafakemalpaşa",
            "Orhaneli",
            "Orhangazi",
            "Yenişehir",
            "Büyükorhan",
            "Harmancık",
            "Nilüfer",
            "Osmangazi",
            "Yıldırım",
            "Gürsu",
            "Kestel",
          ],
        },
        {
          il: "Çanakkale",
          plaka: 17,
          ilceleri: [
            "Ayvacık",
            "Bayramiç",
            "Biga",
            "Bozcaada",
            "Çan",
            "Merkez",
            "Eceabat",
            "Ezine",
            "Gelibolu",
            "Gökçeada",
            "Lapseki",
            "Yenice",
          ],
        },
        {
          il: "Çankırı",
          plaka: 18,
          ilceleri: [
            "Merkez",
            "Çerkeş",
            "Eldivan",
            "Ilgaz",
            "Kurşunlu",
            "Orta",
            "Şabanözü",
            "Yapraklı",
            "Atkaracalar",
            "Kızılırmak",
            "Bayramören",
            "Korgun",
          ],
        },
        {
          il: "Çorum",
          plaka: 19,
          ilceleri: [
            "Alaca",
            "Bayat",
            "Merkez",
            "İskilip",
            "Kargı",
            "Mecitözü",
            "Ortaköy",
            "Osmancık",
            "Sungurlu",
            "Boğazkale",
            "Uğurludağ",
            "Dodurga",
            "Laçin",
            "Oğuzlar",
          ],
        },
        {
          il: "Denizli",
          plaka: 20,
          ilceleri: [
            "Acıpayam",
            "Buldan",
            "Çal",
            "Çameli",
            "Çardak",
            "Çivril",
            "Merkez",
            "Merkezefendi",
            "Pamukkale",
            "Güney",
            "Kale",
            "Sarayköy",
            "Tavas",
            "Babadağ",
            "Bekilli",
            "Honaz",
            "Serinhisar",
            "Baklan",
            "Beyağaç",
            "Bozkurt",
          ],
        },
        {
          il: "Diyarbakır",
          plaka: 21,
          ilceleri: [
            "Kocaköy",
            "Çermik",
            "Çınar",
            "Çüngüş",
            "Dicle",
            "Ergani",
            "Hani",
            "Hazro",
            "Kulp",
            "Lice",
            "Silvan",
            "Eğil",
            "Bağlar",
            "Kayapınar",
            "Sur",
            "Yenişehir",
            "Bismil",
          ],
        },
        {
          il: "Edirne",
          plaka: 22,
          ilceleri: [
            "Merkez",
            "Enez",
            "Havsa",
            "İpsala",
            "Keşan",
            "Lalapaşa",
            "Meriç",
            "Uzunköprü",
            "Süloğlu",
          ],
        },
        {
          il: "Elazığ",
          plaka: 23,
          ilceleri: [
            "Ağın",
            "Baskil",
            "Merkez",
            "Karakoçan",
            "Keban",
            "Maden",
            "Palu",
            "Sivrice",
            "Arıcak",
            "Kovancılar",
            "Alacakaya",
          ],
        },
        {
          il: "Erzincan",
          plaka: 24,
          ilceleri: [
            "Çayırlı",
            "Merkez",
            "İliç",
            "Kemah",
            "Kemaliye",
            "Refahiye",
            "Tercan",
            "Üzümlü",
            "Otlukbeli",
          ],
        },
        {
          il: "Erzurum",
          plaka: 25,
          ilceleri: [
            "Aşkale",
            "Çat",
            "Hınıs",
            "Horasan",
            "İspir",
            "Karayazı",
            "Narman",
            "Oltu",
            "Olur",
            "Pasinler",
            "Şenkaya",
            "Tekman",
            "Tortum",
            "Karaçoban",
            "Uzundere",
            "Pazaryolu",
            "Köprüköy",
            "Palandöken",
            "Yakutiye",
            "Aziziye",
          ],
        },
        {
          il: "Eskişehir",
          plaka: 26,
          ilceleri: [
            "Çifteler",
            "Mahmudiye",
            "Mihalıççık",
            "Sarıcakaya",
            "Seyitgazi",
            "Sivrihisar",
            "Alpu",
            "Beylikova",
            "İnönü",
            "Günyüzü",
            "Han",
            "Mihalgazi",
            "Odunpazarı",
            "Tepebaşı",
          ],
        },
        {
          il: "Gaziantep",
          plaka: 27,
          ilceleri: [
            "Araban",
            "İslahiye",
            "Nizip",
            "Oğuzeli",
            "Yavuzeli",
            "Şahinbey",
            "Şehitkamil",
            "Karkamış",
            "Nurdağı",
          ],
        },
        {
          il: "Giresun",
          plaka: 28,
          ilceleri: [
            "Alucra",
            "Bulancak",
            "Dereli",
            "Espiye",
            "Eynesil",
            "Merkez",
            "Görele",
            "Keşap",
            "Şebinkarahisar",
            "Tirebolu",
            "Piraziz",
            "Yağlıdere",
            "Çamoluk",
            "Çanakçı",
            "Doğankent",
            "Güce",
          ],
        },
        {
          il: "Gümüşhane",
          plaka: 29,
          ilceleri: ["Merkez", "Kelkit", "Şiran", "Torul", "Köse", "Kürtün"],
        },
        {
          il: "Hakkari",
          plaka: 30,
          ilceleri: ["Çukurca", "Merkez", "Şemdinli", "Yüksekova"],
        },
        {
          il: "Hatay",
          plaka: 31,
          ilceleri: [
            "Altınözü",
            "Arsuz",
            "Defne",
            "Dörtyol",
            "Hassa",
            "Antakya",
            "İskenderun",
            "Kırıkhan",
            "Payas",
            "Reyhanlı",
            "Samandağ",
            "Yayladağı",
            "Erzin",
            "Belen",
            "Kumlu",
          ],
        },
        {
          il: "Isparta",
          plaka: 32,
          ilceleri: [
            "Atabey",
            "Eğirdir",
            "Gelendost",
            "Merkez",
            "Keçiborlu",
            "Senirkent",
            "Sütçüler",
            "Şarkikaraağaç",
            "Uluborlu",
            "Yalvaç",
            "Aksu",
            "Gönen",
            "Yenişarbademli",
          ],
        },
        {
          il: "Mersin",
          plaka: 33,
          ilceleri: [
            "Anamur",
            "Erdemli",
            "Gülnar",
            "Mut",
            "Silifke",
            "Tarsus",
            "Aydıncık",
            "Bozyazı",
            "Çamlıyayla",
            "Akdeniz",
            "Mezitli",
            "Toroslar",
            "Yenişehir",
          ],
        },
        {
          il: "İstanbul",
          plaka: 34,
          ilceleri: [
            "Adalar",
            "Bakırköy",
            "Beşiktaş",
            "Beykoz",
            "Beyoğlu",
            "Çatalca",
            "Eyüp",
            "Fatih",
            "Gaziosmanpaşa",
            "Kadıköy",
            "Kartal",
            "Sarıyer",
            "Silivri",
            "Şile",
            "Şişli",
            "Üsküdar",
            "Zeytinburnu",
            "Büyükçekmece",
            "Kağıthane",
            "Küçükçekmece",
            "Pendik",
            "Ümraniye",
            "Bayrampaşa",
            "Avcılar",
            "Bağcılar",
            "Bahçelievler",
            "Güngören",
            "Maltepe",
            "Sultanbeyli",
            "Tuzla",
            "Esenler",
            "Arnavutköy",
            "Ataşehir",
            "Başakşehir",
            "Beylikdüzü",
            "Çekmeköy",
            "Esenyurt",
            "Sancaktepe",
            "Sultangazi",
          ],
        },
        {
          il: "İzmir",
          plaka: 35,
          ilceleri: [
            "Aliağa",
            "Bayındır",
            "Bergama",
            "Bornova",
            "Çeşme",
            "Dikili",
            "Foça",
            "Karaburun",
            "Karşıyaka",
            "Kemalpaşa",
            "Kınık",
            "Kiraz",
            "Menemen",
            "Ödemiş",
            "Seferihisar",
            "Selçuk",
            "Tire",
            "Torbalı",
            "Urla",
            "Beydağ",
            "Buca",
            "Konak",
            "Menderes",
            "Balçova",
            "Çiğli",
            "Gaziemir",
            "Narlıdere",
            "Güzelbahçe",
            "Bayraklı",
            "Karabağlar",
          ],
        },
        {
          il: "Kars",
          plaka: 36,
          ilceleri: [
            "Arpaçay",
            "Digor",
            "Kağızman",
            "Merkez",
            "Sarıkamış",
            "Selim",
            "Susuz",
            "Akyaka",
          ],
        },
        {
          il: "Kastamonu",
          plaka: 37,
          ilceleri: [
            "Abana",
            "Araç",
            "Azdavay",
            "Bozkurt",
            "Cide",
            "Çatalzeytin",
            "Daday",
            "Devrekani",
            "İnebolu",
            "Merkez",
            "Küre",
            "Taşköprü",
            "Tosya",
            "İhsangazi",
            "Pınarbaşı",
            "Şenpazar",
            "Ağlı",
            "Doğanyurt",
            "Hanönü",
            "Seydiler",
          ],
        },
        {
          il: "Kayseri",
          plaka: 38,
          ilceleri: [
            "Bünyan",
            "Develi",
            "Felahiye",
            "İncesu",
            "Pınarbaşı",
            "Sarıoğlan",
            "Sarız",
            "Tomarza",
            "Yahyalı",
            "Yeşilhisar",
            "Akkışla",
            "Talas",
            "Kocasinan",
            "Melikgazi",
            "Hacılar",
            "Özvatan",
          ],
        },
        {
          il: "Kırklareli",
          plaka: 39,
          ilceleri: [
            "Babaeski",
            "Demirköy",
            "Merkez",
            "Kofçaz",
            "Lüleburgaz",
            "Pehlivanköy",
            "Pınarhisar",
            "Vize",
          ],
        },
        {
          il: "Kırşehir",
          plaka: 40,
          ilceleri: [
            "Çiçekdağı",
            "Kaman",
            "Merkez",
            "Mucur",
            "Akpınar",
            "Akçakent",
            "Boztepe",
          ],
        },
        {
          il: "Kocaeli",
          plaka: 41,
          ilceleri: [
            "Gebze",
            "Gölcük",
            "Kandıra",
            "Karamürsel",
            "Körfez",
            "Derince",
            "Başiskele",
            "Çayırova",
            "Darıca",
            "Dilovası",
            "İzmit",
            "Kartepe",
          ],
        },
        {
          il: "Konya",
          plaka: 42,
          ilceleri: [
            "Akşehir",
            "Beyşehir",
            "Bozkır",
            "Cihanbeyli",
            "Çumra",
            "Doğanhisar",
            "Ereğli",
            "Hadim",
            "Ilgın",
            "Kadınhanı",
            "Karapınar",
            "Kulu",
            "Sarayönü",
            "Seydişehir",
            "Yunak",
            "Akören",
            "Altınekin",
            "Derebucak",
            "Hüyük",
            "Karatay",
            "Meram",
            "Selçuklu",
            "Taşkent",
            "Ahırlı",
            "Çeltik",
            "Derbent",
            "Emirgazi",
            "Güneysınır",
            "Halkapınar",
            "Tuzlukçu",
            "Yalıhüyük",
          ],
        },
        {
          il: "Kütahya",
          plaka: 43,
          ilceleri: [
            "Altıntaş",
            "Domaniç",
            "Emet",
            "Gediz",
            "Merkez",
            "Simav",
            "Tavşanlı",
            "Aslanapa",
            "Dumlupınar",
            "Hisarcık",
            "Şaphane",
            "Çavdarhisar",
            "Pazarlar",
          ],
        },
        {
          il: "Malatya",
          plaka: 44,
          ilceleri: [
            "Akçadağ",
            "Arapgir",
            "Arguvan",
            "Darende",
            "Doğanşehir",
            "Hekimhan",
            "Merkez",
            "Pütürge",
            "Yeşilyurt",
            "Battalgazi",
            "Doğanyol",
            "Kale",
            "Kuluncak",
            "Yazıhan",
          ],
        },
        {
          il: "Manisa",
          plaka: 45,
          ilceleri: [
            "Akhisar",
            "Alaşehir",
            "Demirci",
            "Gördes",
            "Kırkağaç",
            "Kula",
            "Merkez",
            "Salihli",
            "Sarıgöl",
            "Saruhanlı",
            "Selendi",
            "Soma",
            "Şehzadeler",
            "Yunusemre",
            "Turgutlu",
            "Ahmetli",
            "Gölmarmara",
            "Köprübaşı",
          ],
        },
        {
          il: "Kahramanmaraş",
          plaka: 46,
          ilceleri: [
            "Afşin",
            "Andırın",
            "Dulkadiroğlu",
            "Onikişubat",
            "Elbistan",
            "Göksun",
            "Merkez",
            "Pazarcık",
            "Türkoğlu",
            "Çağlayancerit",
            "Ekinözü",
            "Nurhak",
          ],
        },
        {
          il: "Mardin",
          plaka: 47,
          ilceleri: [
            "Derik",
            "Kızıltepe",
            "Artuklu",
            "Merkez",
            "Mazıdağı",
            "Midyat",
            "Nusaybin",
            "Ömerli",
            "Savur",
            "Dargeçit",
            "Yeşilli",
          ],
        },
        {
          il: "Muğla",
          plaka: 48,
          ilceleri: [
            "Bodrum",
            "Datça",
            "Fethiye",
            "Köyceğiz",
            "Marmaris",
            "Menteşe",
            "Milas",
            "Ula",
            "Yatağan",
            "Dalaman",
            "Seydikemer",
            "Ortaca",
            "Kavaklıdere",
          ],
        },
        {
          il: "Muş",
          plaka: 49,
          ilceleri: [
            "Bulanık",
            "Malazgirt",
            "Merkez",
            "Varto",
            "Hasköy",
            "Korkut",
          ],
        },
        {
          il: "Nevşehir",
          plaka: 50,
          ilceleri: [
            "Avanos",
            "Derinkuyu",
            "Gülşehir",
            "Hacıbektaş",
            "Kozaklı",
            "Merkez",
            "Ürgüp",
            "Acıgöl",
          ],
        },
        {
          il: "Niğde",
          plaka: 51,
          ilceleri: [
            "Bor",
            "Çamardı",
            "Merkez",
            "Ulukışla",
            "Altunhisar",
            "Çiftlik",
          ],
        },
        {
          il: "Ordu",
          plaka: 52,
          ilceleri: [
            "Akkuş",
            "Altınordu",
            "Aybastı",
            "Fatsa",
            "Gölköy",
            "Korgan",
            "Kumru",
            "Mesudiye",
            "Perşembe",
            "Ulubey",
            "Ünye",
            "Gülyalı",
            "Gürgentepe",
            "Çamaş",
            "Çatalpınar",
            "Çaybaşı",
            "İkizce",
            "Kabadüz",
            "Kabataş",
          ],
        },
        {
          il: "Rize",
          plaka: 53,
          ilceleri: [
            "Ardeşen",
            "Çamlıhemşin",
            "Çayeli",
            "Fındıklı",
            "İkizdere",
            "Kalkandere",
            "Pazar",
            "Merkez",
            "Güneysu",
            "Derepazarı",
            "Hemşin",
            "İyidere",
          ],
        },
        {
          il: "Sakarya",
          plaka: 54,
          ilceleri: [
            "Akyazı",
            "Geyve",
            "Hendek",
            "Karasu",
            "Kaynarca",
            "Sapanca",
            "Kocaali",
            "Pamukova",
            "Taraklı",
            "Ferizli",
            "Karapürçek",
            "Söğütlü",
            "Adapazarı",
            "Arifiye",
            "Erenler",
            "Serdivan",
          ],
        },
        {
          il: "Samsun",
          plaka: 55,
          ilceleri: [
            "Alaçam",
            "Bafra",
            "Çarşamba",
            "Havza",
            "Kavak",
            "Ladik",
            "Terme",
            "Vezirköprü",
            "Asarcık",
            "Ondokuzmayıs",
            "Salıpazarı",
            "Tekkeköy",
            "Ayvacık",
            "Yakakent",
            "Atakum",
            "Canik",
            "İlkadım",
          ],
        },
        {
          il: "Siirt",
          plaka: 56,
          ilceleri: [
            "Baykan",
            "Eruh",
            "Kurtalan",
            "Pervari",
            "Merkez",
            "Şirvan",
            "Tillo",
          ],
        },
        {
          il: "Sinop",
          plaka: 57,
          ilceleri: [
            "Ayancık",
            "Boyabat",
            "Durağan",
            "Erfelek",
            "Gerze",
            "Merkez",
            "Türkeli",
            "Dikmen",
            "Saraydüzü",
          ],
        },
        {
          il: "Sivas",
          plaka: 58,
          ilceleri: [
            "Divriği",
            "Gemerek",
            "Gürün",
            "Hafik",
            "İmranlı",
            "Kangal",
            "Koyulhisar",
            "Merkez",
            "Suşehri",
            "Şarkışla",
            "Yıldızeli",
            "Zara",
            "Akıncılar",
            "Altınyayla",
            "Doğanşar",
            "Gölova",
            "Ulaş",
          ],
        },
        {
          il: "Tekirdağ",
          plaka: 59,
          ilceleri: [
            "Çerkezköy",
            "Çorlu",
            "Ergene",
            "Hayrabolu",
            "Malkara",
            "Muratlı",
            "Saray",
            "Süleymanpaşa",
            "Kapaklı",
            "Şarköy",
            "Marmaraereğlisi",
          ],
        },
        {
          il: "Tokat",
          plaka: 60,
          ilceleri: [
            "Almus",
            "Artova",
            "Erbaa",
            "Niksar",
            "Reşadiye",
            "Merkez",
            "Turhal",
            "Zile",
            "Pazar",
            "Yeşilyurt",
            "Başçiftlik",
            "Sulusaray",
          ],
        },
        {
          il: "Trabzon",
          plaka: 61,
          ilceleri: [
            "Akçaabat",
            "Araklı",
            "Arsin",
            "Çaykara",
            "Maçka",
            "Of",
            "Ortahisar",
            "Sürmene",
            "Tonya",
            "Vakfıkebir",
            "Yomra",
            "Beşikdüzü",
            "Şalpazarı",
            "Çarşıbaşı",
            "Dernekpazarı",
            "Düzköy",
            "Hayrat",
            "Köprübaşı",
          ],
        },
        {
          il: "Tunceli",
          plaka: 62,
          ilceleri: [
            "Çemişgezek",
            "Hozat",
            "Mazgirt",
            "Nazımiye",
            "Ovacık",
            "Pertek",
            "Pülümür",
            "Merkez",
          ],
        },
        {
          il: "Şanlıurfa",
          plaka: 63,
          ilceleri: [
            "Akçakale",
            "Birecik",
            "Bozova",
            "Ceylanpınar",
            "Eyyübiye",
            "Halfeti",
            "Haliliye",
            "Hilvan",
            "Karaköprü",
            "Siverek",
            "Suruç",
            "Viranşehir",
            "Harran",
          ],
        },
        {
          il: "Uşak",
          plaka: 64,
          ilceleri: [
            "Banaz",
            "Eşme",
            "Karahallı",
            "Sivaslı",
            "Ulubey",
            "Merkez",
          ],
        },
        {
          il: "Van",
          plaka: 65,
          ilceleri: [
            "Başkale",
            "Çatak",
            "Erciş",
            "Gevaş",
            "Gürpınar",
            "İpekyolu",
            "Muradiye",
            "Özalp",
            "Tuşba",
            "Bahçesaray",
            "Çaldıran",
            "Edremit",
            "Saray",
          ],
        },
        {
          il: "Yozgat",
          plaka: 66,
          ilceleri: [
            "Akdağmadeni",
            "Boğazlıyan",
            "Çayıralan",
            "Çekerek",
            "Sarıkaya",
            "Sorgun",
            "Şefaatli",
            "Yerköy",
            "Merkez",
            "Aydıncık",
            "Çandır",
            "Kadışehri",
            "Saraykent",
            "Yenifakılı",
          ],
        },
        {
          il: "Zonguldak",
          plaka: 67,
          ilceleri: [
            "Çaycuma",
            "Devrek",
            "Ereğli",
            "Merkez",
            "Alaplı",
            "Gökçebey",
          ],
        },
        {
          il: "Aksaray",
          plaka: 68,
          ilceleri: [
            "Ağaçören",
            "Eskil",
            "Gülağaç",
            "Güzelyurt",
            "Merkez",
            "Ortaköy",
            "Sarıyahşi",
          ],
        },
        {
          il: "Bayburt",
          plaka: 69,
          ilceleri: ["Merkez", "Aydıntepe", "Demirözü"],
        },
        {
          il: "Karaman",
          plaka: 70,
          ilceleri: [
            "Ermenek",
            "Merkez",
            "Ayrancı",
            "Kazımkarabekir",
            "Başyayla",
            "Sarıveliler",
          ],
        },
        {
          il: "Kırıkkale",
          plaka: 71,
          ilceleri: [
            "Delice",
            "Keskin",
            "Merkez",
            "Sulakyurt",
            "Bahşili",
            "Balışeyh",
            "Çelebi",
            "Karakeçili",
            "Yahşihan",
          ],
        },
        {
          il: "Batman",
          plaka: 72,
          ilceleri: [
            "Merkez",
            "Beşiri",
            "Gercüş",
            "Kozluk",
            "Sason",
            "Hasankeyf",
          ],
        },
        {
          il: "Şırnak",
          plaka: 73,
          ilceleri: [
            "Beytüşşebap",
            "Cizre",
            "İdil",
            "Silopi",
            "Merkez",
            "Uludere",
            "Güçlükonak",
          ],
        },
        {
          il: "Bartın",
          plaka: 74,
          ilceleri: ["Merkez", "Kurucaşile", "Ulus", "Amasra"],
        },
        {
          il: "Ardahan",
          plaka: 75,
          ilceleri: ["Merkez", "Çıldır", "Göle", "Hanak", "Posof", "Damal"],
        },
        {
          il: "Iğdır",
          plaka: 76,
          ilceleri: ["Aralık", "Merkez", "Tuzluca", "Karakoyunlu"],
        },
        {
          il: "Yalova",
          plaka: 77,
          ilceleri: [
            "Merkez",
            "Altınova",
            "Armutlu",
            "Çınarcık",
            "Çiftlikköy",
            "Termal",
          ],
        },
        {
          il: "Karabük",
          plaka: 78,
          ilceleri: [
            "Eflani",
            "Eskipazar",
            "Merkez",
            "Ovacık",
            "Safranbolu",
            "Yenice",
          ],
        },
        {
          il: "Kilis",
          plaka: 79,
          ilceleri: ["Merkez", "Elbeyli", "Musabeyli", "Polateli"],
        },
        {
          il: "Osmaniye",
          plaka: 80,
          ilceleri: [
            "Bahçe",
            "Kadirli",
            "Merkez",
            "Düziçi",
            "Hasanbeyli",
            "Sumbas",
            "Toprakkale",
          ],
        },
        {
          il: "Düzce",
          plaka: 81,
          ilceleri: [
            "Akçakoca",
            "Merkez",
            "Yığılca",
            "Cumayeri",
            "Gölyaka",
            "Çilimli",
            "Gümüşova",
            "Kaynaşlı",
          ],
        },
      ],
      activePicker: null,
      date: null,
      menu: false,
      submitted: false,
      fillSubMethod: [],
      fillDistrict: [],
      excelDatalist: [],
      select: { yontemAdi: "" },
      message: "",
      show: false,
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     if (
  //       !vm.$store.state.auth.user ||
  //       !vm.$store.state.auth.user.roles.includes("ROLE_ADMIN") ||
  //       !vm.$store.state.auth.user.roles.includes("ROLE_MODERATOR")
  //     ) {
  //       next({ name: "home" });
  //     }
  //   });
  // },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    getHeader(sheet) {
      const XLSX = xlsx;
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]); // worksheet['!ref'] Is the valid range of the worksheet
      let C;
      /* Get cell value start in the first row */
      const R = range.s.r; //Line / / column C
      let i = 0;
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* Get the cell value based on the address  find the cell in the first row */
        var hdr = "UNKNOWN" + C; // replace with your desired default
        // XLSX.utils.format_cell Generate cell text value
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        if (hdr.indexOf("UNKNOWN") > -1) {
          if (!i) {
            hdr = "__EMPTY";
          } else {
            hdr = "__EMPTY_" + i;
          }
          i++;
        }
        headers.push(hdr);
      }
      return headers;
    },
    /**
     * Import table
     */
    importExcel(e) {
      this.excelDatalist = [];
      const files = e.target.files;
      console.log(files);

      if (!files.length) {
        this.show = false;
      } else if (!/\.(csv|xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.show = true;
        this.message = "Yalnızca .csv uzantılı dosya yukleyebilirsiniz!";
        return;
      } else {
        this.show = false;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;

          const XLSX = xlsx;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // Generate JSON table content，wb.Sheets[Sheet]    Get the data of the first sheet
          const excellist = []; // Clear received data
          // Edit data
          for (var i = 0; i < ws.length; i++) {
            excellist.push(ws[i]);
          }
          this.excelDatalist = excellist;
          console.log("Read results", this.excelDatalist); // At this point, you get an array containing objects that need to be processed
          // Get header2-1
          const a = workbook.Sheets[workbook.SheetNames[0]];
          const headers = this.getHeader(a);
          console.log("headers", headers);
          // Get header2-2
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(files[0]);
      // var input = document.getElementById("upload");
      // input.value = "";
    },
    handleChange(event) {
      this.methodSubmethod.filter((elem) => {
        if (elem.yontemAdi === event) {
          this.fillSubMethod = elem.altYontemler;
        }
      });
      // var self = this;
      // self.district_id = event;
    },
    handleCityChange(event) {
      this.cities.filter((elem) => {
        if (elem.il === event) {
          this.fillDistrict = elem.ilceleri;
        }
      });
      // var self = this;
      // self.district_id = event;
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    dataImporter() {
      var arr = this.excelDatalist;
      console.log(this.excelDatalist);
      for (let i = 0; i < arr.length; i++) {
        var data = {
          nokta_adi: arr[i].nokta_adi ? arr[i].nokta_adi : null,
          yontem: arr[i].yontem ? arr[i].yontem : null,
          alt_yontem: arr[i].alt_yontem ? arr[i].alt_yontem : null,
          calisma_amaci: arr[i].calisma_amaci ? arr[i].calisma_amaci : null,
          satilabilirlik: arr[i].satilabilirlik ? arr[i].satilabilirlik : null,
          ham_veri: arr[i].ham_veri ? arr[i].ham_veri : null,
          calisma_tarihi: arr[i].calisma_tarihi ? arr[i].calisma_tarihi : null,
          proje_kodu: arr[i].proje_kodu ? arr[i].proje_kodu : null,
          rapor_no: arr[i].rapor_no ? arr[i].rapor_no : null,
          kuyu_arsiv_no: arr[i].kuyu_arsiv_no ? arr[i].kuyu_arsiv_no : null,
          jeofizik_arsiv_no: arr[i].jeofizik_arsiv_no
            ? arr[i].jeofizik_arsiv_no
            : null,
          derleme_no: arr[i].derleme_no ? arr[i].derleme_no : null,
          cd_no: arr[i].cd_no ? arr[i].cd_no : null,
          il: arr[i].il ? arr[i].il : null,
          ilce: arr[i].ilce ? arr[i].ilce : null,
          x: arr[i].x ? arr[i].x : null,
          y: arr[i].y ? arr[i].y : null,
          z: arr[i].z ? arr[i].z : null,
          profil_baslangic_x: arr[i].profil_baslangic_x
            ? arr[i].profil_baslangic_x
            : null,
          profil_baslangic_y: arr[i].profil_baslangic_y
            ? arr[i].profil_baslangic_y
            : null,
          profil_bitis_x: arr[i].profil_bitis_x ? arr[i].profil_bitis_x : null,
          profil_bitis_y: arr[i].profil_bitis_y ? arr[i].profil_bitis_y : null,
          zone: arr[i].zone ? arr[i].zone : null,
          datum: arr[i].datum ? arr[i].datum : null,
          besyuzbin: arr[i].besyuzbin ? arr[i].besyuzbin : null,
          yuzbin: arr[i].yuzbin ? arr[i].yuzbin : null,
          yirmibesbin: arr[i].yirmibesbin ? arr[i].yirmibesbin : null,
          olculen_parametre_ler: arr[i].olculen_parametre_ler
            ? arr[i].olculen_parametre_ler
            : null,
          acilim_yonu: arr[i].acilim_yonu ? arr[i].acilim_yonu : null,
          acilim_yontemi: arr[i].acilim_yontemi ? arr[i].acilim_yontemi : null,
          frekans_araligi: arr[i].frekans_araligi
            ? arr[i].frekans_araligi
            : null,
          mt_olcu_suresisaat: arr[i].mt_olcu_suresisaat
            ? arr[i].mt_olcu_suresisaat
            : null,

          z_bileseni: arr[i].z_bileseni ? arr[i].z_bileseni : null,

          amt_olcusu: arr[i].amt_olcusu ? arr[i].amt_olcusu : null,

          amt_olcu_suresi: arr[i].amt_olcu_suresi
            ? arr[i].amt_olcu_suresi
            : null,

          tem_olcusu: arr[i].tem_olcusu ? arr[i].tem_olcusu : null,

          kalibrasyon_dosyasi: arr[i].kalibrasyon_dosyasi
            ? arr[i].kalibrasyon_dosyasi
            : null,

          veri_formati: arr[i].veri_formati ? arr[i].veri_formati : null,

          ab2_m: arr[i].ab2_m ? arr[i].ab2_m : null,

          derinlik_m_gr: arr[i].derinlik_m_gr ? arr[i].derinlik_m_gr : null,

          derinlik_m_neu: arr[i].derinlik_m_neu ? arr[i].derinlik_m_neu : null,
          derinlik_m_den: arr[i].derinlik_m_den ? arr[i].derinlik_m_den : null,
          derinlik_m_res: arr[i].derinlik_m_res ? arr[i].derinlik_m_res : null,
          derinlik_m_sp: arr[i].derinlik_m_sp ? arr[i].derinlik_m_sp : null,
          derinlik_m_cal: arr[i].derinlik_m_cal ? arr[i].derinlik_m_cal : null,
          derinlik_m_term: arr[i].derinlik_m_term
            ? arr[i].derinlik_m_term
            : null,
          derinlik_m_sgr: arr[i].derinlik_m_sgr ? arr[i].derinlik_m_sgr : null,
          derinlik_m_cbl: arr[i].derinlik_m_cbl ? arr[i].derinlik_m_cbl : null,
          derinlik_m_son: arr[i].derinlik_m_son ? arr[i].derinlik_m_son : null,
          derinlik_m_ccl: arr[i].derinlik_m_ccl ? arr[i].derinlik_m_ccl : null,
          hat_boyu_m: arr[i].hat_boyu_m ? arr[i].hat_boyu_m : null,
          kayit_boyu_sn: arr[i].kayit_boyu_sn ? arr[i].kayit_boyu_sn : null,
          sweep_suresi_sn: arr[i].sweep_suresi_sn
            ? arr[i].sweep_suresi_sn
            : null,
          sweep_tipi: arr[i].sweep_tipi ? arr[i].sweep_tipi : null,
          sweep_sayisi: arr[i].sweep_sayisi ? arr[i].sweep_sayisi : null,
          sweep_frekanslari_sn_hz: arr[i].sweep_frekanslari_sn_hz
            ? arr[i].sweep_frekanslari_sn_hz
            : null,
          sweep_taper_ms: arr[i].sweep_taper_ms ? arr[i].sweep_taper_ms : null,
          yayim_tipi: arr[i].yayim_tipi ? arr[i].yayim_tipi : null,
          offsetm: arr[i].offsetm ? arr[i].offsetm : null,
          jeofon_dizilimi: arr[i].jeofon_dizilimi
            ? arr[i].jeofon_dizilimi
            : null,
          grup_araligim: arr[i].grup_araligim ? arr[i].grup_araligim : null,
          atis_araligim: arr[i].atis_araligim ? arr[i].atis_araligim : null,
          ornekleme_araligim: arr[i].ornekleme_araligim
            ? arr[i].ornekleme_araligim
            : null,
          ekipman: arr[i].ekipman ? arr[i].ekipman : null,
          enerji_kaynagi: arr[i].enerji_kaynagi ? arr[i].enerji_kaynagi : null,
          km2: arr[i].km2 ? arr[i].km2 : null,
          profil_boyukm: arr[i].profil_boyukm ? arr[i].profil_boyukm : null,
          elektrot_araligi: arr[i].elektrot_araligi
            ? arr[i].elektrot_araligi
            : null,
          dizilim_turu: arr[i].dizilim_turu ? arr[i].dizilim_turu : null,
          seviye_sayisi: arr[i].seviye_sayisi ? arr[i].seviye_sayisi : null,
          profil_araligi: arr[i].profil_araligi ? arr[i].profil_araligi : null,
          a_1: arr[i].a_1 ? arr[i].a_1 : null,
          a_2: arr[i].a_2 ? arr[i].a_2 : null,
          a_3: arr[i].a_3 ? arr[i].a_3 : null,
          a_4: arr[i].a_4 ? arr[i].a_4 : null,
          dis_loop_boyutu: arr[i].dis_loop_boyutu
            ? arr[i].dis_loop_boyutu
            : null,
          published: false,
        };
        TutorialDataService.create(data)
          .then((response) => {
            this.tutorial.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("bitti");
      }
      this.excelDatalist = [];
    },
    saveTutorial() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        details: this.tutorial.details,
      };

      TutorialDataService.create(data)
        .then((response) => {
          this.tutorial.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newTutorial() {
      this.submitted = false;
      this.tutorial = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 400px;
  position: relative;
  z-index: 4;
}
</style>
