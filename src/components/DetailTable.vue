<template>
  <table class="table table-hover table-sm">
    <tbody>
      <tr v-if="currentTutorial.nokta_adi">
        <td>Nokta Adı</td>
        <td>{{ currentTutorial.nokta_adi }}</td>
      </tr>
      <tr v-if="currentTutorial.yontem">
        <td>Yöntem</td>
        <td>{{ currentTutorial.yontem }}</td>
      </tr>
      <tr v-if="currentTutorial.alt_yontem">
        <td>Alt Yöntem</td>
        <td>{{ currentTutorial.alt_yontem }}</td>
      </tr>
      <tr v-if="currentTutorial.calisma_amaci">
        <td>Çalışma Amacı</td>
        <td>{{ currentTutorial.calisma_amaci }}</td>
      </tr>
      <tr v-if="currentTutorial.satilabilirlik">
        <td>Satılabilirlik</td>
        <td>{{ currentTutorial.satilabilirlik }}</td>
      </tr>
      <tr v-if="currentTutorial.ham_veri">
        <td>Ham Veri</td>
        <td>{{ currentTutorial.ham_veri }}</td>
      </tr>
      <tr v-if="currentTutorial.calisma_tarihi">
        <td>Çalışma Tarihi</td>
        <td>{{ currentTutorial.calisma_tarihi }}</td>
      </tr>
      <tr v-if="currentTutorial.proje_kodu">
        <td>Proje Kodu</td>
        <td>{{ currentTutorial.proje_kodu }}</td>
      </tr>
      <tr v-if="currentTutorial.rapor_no">
        <td>Rapor No</td>
        <td>{{ currentTutorial.rapor_no }}</td>
      </tr>
      <tr v-if="currentTutorial.kuyu_arsiv_no">
        <td>Kuyu Arşiv No</td>
        <td>{{ currentTutorial.kuyu_arsiv_no }}</td>
      </tr>
      <tr v-if="currentTutorial.jeofizik_arsiv_no">
        <td>Jeofizik Arşiv No</td>
        <td>{{ currentTutorial.jeofizik_arsiv_no }}</td>
      </tr>
      <tr v-if="currentTutorial.derleme_no">
        <td>Derleme No</td>
        <td>{{ currentTutorial.derleme_no }}</td>
      </tr>
      <tr v-if="currentTutorial.cd_no">
        <td>CD No</td>
        <td>{{ currentTutorial.cd_no }}</td>
      </tr>
      <tr v-if="currentTutorial.il">
        <td>İl</td>
        <td>{{ currentTutorial.il }}</td>
      </tr>
      <tr v-if="currentTutorial.ilce">
        <td>İlçe</td>
        <td>{{ currentTutorial.ilce }}</td>
      </tr>
      <tr v-if="currentTutorial.x">
        <td>X</td>
        <td>{{ currentTutorial.x }}</td>
      </tr>
      <tr v-if="currentTutorial.y">
        <td>Y</td>
        <td>{{ currentTutorial.y }}</td>
      </tr>
      <tr v-if="currentTutorial.z">
        <td>Z</td>
        <td>{{ currentTutorial.z }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_baslangic_x">
        <td>Profil Başlangıç (X)</td>
        <td>{{ currentTutorial.profil_baslangic_x }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_baslangic_y">
        <td>Profil Başlangıç (Y)</td>
        <td>{{ currentTutorial.profil_baslangic_y }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_bitis_x">
        <td>Profil Bitiş (X)</td>
        <td>{{ currentTutorial.profil_bitis_x }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_bitis_y">
        <td>Profil Bitiş (Y)</td>
        <td>{{ currentTutorial.profil_bitis_y }}</td>
      </tr>
      <tr v-if="currentTutorial.zone">
        <td>Zone</td>
        <td>{{ currentTutorial.zone }}</td>
      </tr>
      <tr v-if="currentTutorial.datum">
        <td>Datum</td>
        <td>{{ currentTutorial.datum }}</td>
      </tr>
      <tr v-if="currentTutorial.besyuzbin">
        <td>1/500000</td>
        <td>{{ currentTutorial.besyuzbin }}</td>
      </tr>
      <tr v-if="currentTutorial.yuzbin">
        <td>1/100000</td>
        <td>{{ currentTutorial.yuzbin }}</td>
      </tr>
      <tr v-if="currentTutorial.yirmibesbin">
        <td>1/25000</td>
        <td>{{ currentTutorial.yirmibesbin }}</td>
      </tr>
      <tr v-if="currentTutorial.olculen_parametre_ler">
        <td>Ölçülen Parametre(ler)</td>
        <td>{{ currentTutorial.olculen_parametre_ler }}</td>
      </tr>
      <tr v-if="currentTutorial.acilim_yonu">
        <td>Açılım Yönü</td>
        <td>{{ currentTutorial.acilim_yonu }}</td>
      </tr>
      <tr v-if="currentTutorial.frekans_araligi">
        <td>Frekans Aralığı</td>
        <td>{{ currentTutorial.frekans_araligi }}</td>
      </tr>
      <tr v-if="currentTutorial.mt_olcu_suresisaat">
        <td>MT Ölçü Süresi (Saat)</td>
        <td>{{ currentTutorial.mt_olcu_suresisaat }}</td>
      </tr>
      <tr v-if="currentTutorial.z_bileseni">
        <td>Z Bileşeni</td>
        <td>{{ currentTutorial.z_bileseni }}</td>
      </tr>
      <tr v-if="currentTutorial.amt_olcusu">
        <td>AMT Ölçüsü</td>
        <td>{{ currentTutorial.amt_olcusu }}</td>
      </tr>
      <tr v-if="currentTutorial.amt_olcu_suresi">
        <td>AMT Ölçü Süresi</td>
        <td>{{ currentTutorial.amt_olcu_suresi }}</td>
      </tr>
      <tr v-if="currentTutorial.tem_olcusu">
        <td>TEM Ölçüsü</td>
        <td>{{ currentTutorial.tem_olcusu }}</td>
      </tr>
      <tr v-if="currentTutorial.kalibrasyon_dosyasi">
        <td>Kalibrasyon Dosyası</td>
        <td>{{ currentTutorial.kalibrasyon_dosyasi }}</td>
      </tr>
      <tr v-if="currentTutorial.veri_formati">
        <td>Veri Formatı</td>
        <td>{{ currentTutorial.veri_formati }}</td>
      </tr>
      <tr v-if="currentTutorial.ab2_m">
        <td>AB/2 (m)</td>
        <td>{{ currentTutorial.ab2_m }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_gr">
        <td>Derinlik (m) gr</td>
        <td>{{ currentTutorial.derinlik_m_gr }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_neu">
        <td>Derinlik (m) neu</td>
        <td>{{ currentTutorial.derinlik_m_neu }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_den">
        <td>Derinlik (m) den</td>
        <td>{{ currentTutorial.derinlik_m_den }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_res">
        <td>Derinlik (m) res</td>
        <td>{{ currentTutorial.derinlik_m_res }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_sp">
        <td>Derinlik (m) sp</td>
        <td>{{ currentTutorial.derinlik_m_sp }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_cal">
        <td>Derinlik (m) cal</td>
        <td>{{ currentTutorial.derinlik_m_cal }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_term">
        <td>Derinlik (m) term</td>
        <td>{{ currentTutorial.derinlik_m_term }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_sgr">
        <td>Derinlik (m) sgr</td>
        <td>{{ currentTutorial.derinlik_m_sgr }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_cbl">
        <td>Derinlik (m) cbl</td>
        <td>{{ currentTutorial.derinlik_m_cbl }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_son">
        <td>Derinlik (m) son</td>
        <td>{{ currentTutorial.derinlik_m_son }}</td>
      </tr>
      <tr v-if="currentTutorial.derinlik_m_ccl">
        <td>Derinlik (m) ccl</td>
        <td>{{ currentTutorial.derinlik_m_ccl }}</td>
      </tr>
      <tr v-if="currentTutorial.hat_boyu_m">
        <td>Hat Booyu (m)</td>
        <td>{{ currentTutorial.hat_boyu_m }}</td>
      </tr>
      <tr v-if="currentTutorial.kayit_boyu_sn">
        <td>Kayıt Boyu (sn)</td>
        <td>{{ currentTutorial.kayit_boyu_sn }}</td>
      </tr>
      <tr v-if="currentTutorial.sweep_suresi_sn">
        <td>Sweep Suresi (sn)</td>
        <td>{{ currentTutorial.sweep_suresi_sn }}</td>
      </tr>
      <tr v-if="currentTutorial.sweep_tipi">
        <td>Sweep Tipi</td>
        <td>{{ currentTutorial.sweep_tipi }}</td>
      </tr>
      <tr v-if="currentTutorial.sweep_sayisi">
        <td>Sweep Sayısı</td>
        <td>{{ currentTutorial.sweep_sayisi }}</td>
      </tr>
      <tr v-if="currentTutorial.sweep_frekanslari_sn_hz">
        <td>Sweep Frekansları (sn hz)</td>
        <td>{{ currentTutorial.sweep_frekanslari_sn_hz }}</td>
      </tr>
      <tr v-if="currentTutorial.sweep_taper_ms">
        <td>Sweep Taper (ms)</td>
        <td>{{ currentTutorial.sweep_taper_ms }}</td>
      </tr>
      <tr v-if="currentTutorial.yayim_tipi">
        <td>Yayım Tipi</td>
        <td>{{ currentTutorial.yayim_tipi }}</td>
      </tr>
      <tr v-if="currentTutorial.offsetm">
        <td>Offset (m)</td>
        <td>{{ currentTutorial.offsetm }}</td>
      </tr>
      <tr v-if="currentTutorial.jeofon_dizilimi">
        <td>Jeofon Dizilimi</td>
        <td>{{ currentTutorial.jeofon_dizilimi }}</td>
      </tr>
      <tr v-if="currentTutorial.grup_araligim">
        <td>Grup Aralığı (m)</td>
        <td>{{ currentTutorial.grup_araligim }}</td>
      </tr>
      <tr v-if="currentTutorial.atis_araligim">
        <td>Atış Aralığı (m)</td>
        <td>{{ currentTutorial.atis_araligim }}</td>
      </tr>
      <tr v-if="currentTutorial.ornekleme_araligim">
        <td>Örnekleme Aralığı (m)</td>
        <td>{{ currentTutorial.ornekleme_araligim }}</td>
      </tr>
      <tr v-if="currentTutorial.ekipman">
        <td>Ekipman</td>
        <td>{{ currentTutorial.ekipman }}</td>
      </tr>
      <tr v-if="currentTutorial.enerji_kaynagi">
        <td>Enerji Kaynağı</td>
        <td>{{ currentTutorial.enerji_kaynagi }}</td>
      </tr>
      <tr v-if="currentTutorial.km2">
        <td>KM2</td>
        <td>{{ currentTutorial.km2 }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_boyukm">
        <td>Profil Boyu (km)</td>
        <td>{{ currentTutorial.profil_boyukm }}</td>
      </tr>
      <tr v-if="currentTutorial.elektrot_araligi">
        <td>Elektrot Aralığı</td>
        <td>{{ currentTutorial.elektrot_araligi }}</td>
      </tr>
      <tr v-if="currentTutorial.dizilim_turu">
        <td>Dizilim Türü</td>
        <td>{{ currentTutorial.dizilim_turu }}</td>
      </tr>
      <tr v-if="currentTutorial.seviye_sayisi">
        <td>Seviye Sayısı</td>
        <td>{{ currentTutorial.seviye_sayisi }}</td>
      </tr>
      <tr v-if="currentTutorial.profil_araligi">
        <td>Profil Aralığı</td>
        <td>{{ currentTutorial.profil_araligi }}</td>
      </tr>
      <tr v-if="currentTutorial.a1">
        <td>A1</td>
        <td>{{ currentTutorial.a_1 }}</td>
      </tr>
      <tr v-if="currentTutorial.a2">
        <td>A2</td>
        <td>{{ currentTutorial.a_2 }}</td>
      </tr>
      <tr v-if="currentTutorial.a3">
        <td>A3</td>
        <td>{{ currentTutorial.a_3 }}</td>
      </tr>
      <tr v-if="currentTutorial.a4">
        <td>A4</td>
        <td>{{ currentTutorial.a_4 }}</td>
      </tr>
      <tr v-if="currentTutorial.dis_loop_boyutu">
        <td>Dış Loop Boyutu</td>
        <td>{{ currentTutorial.dis_loop_boyutu }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "DetailTable",
  props: ["currentTutorial"],
};
</script>
