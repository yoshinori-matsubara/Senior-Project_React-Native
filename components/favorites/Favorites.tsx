import React, { useState, useEffect, useContext, memo } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import Icons from "./Icons";
import { Prefecture } from "../../data/globals";
import { MyContext } from "../../App";
import LottieView from "lottie-react-native";


const SERVER_URL =
  "https://o49zrrdot8.execute-api.us-east-1.amazonaws.com/tokitabi";

const Favorites = memo(() => {
  const [page, setPage, prefecture, setPrefecture] = useContext(MyContext);
  const [favoriteData, setFavoriteData] = useState<Prefecture[]>([]);

  useEffect(() => {
    (async () => {
      const getFavoriteData = await fetch(`${SERVER_URL}/api/favorites`).then(
        (data) => data.json()
      );
      setFavoriteData(getFavoriteData);
    })();
  }, []);

  return (
    <>
      <ImageBackground
        source={require("/Users/user/Desktop/Senior-Project_React-Native/assets/homeBackImg.png")}
        style={styles.container}
        resizeMode="cover" // 画像をコンテナに合わせて拡大/縮小する
      >
        <LottieView
          source={require("../../assets/lottie/42070-travel-is-fun.json")}
          autoPlay={true}
          style={{ position: "absolute", width: "90%", alignItems: "center", bottom: 25 }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <Text style={styles.good}>お気に入り</Text>
            {favoriteData.length ? (
              <Icons
                favoriteData={favoriteData}
                setPage={setPage}
                setPrefecture={setPrefecture}
              />
            ) : (
              <Text style={styles.zanteitaisaku}>
                行きたい場所をいいねしよう！
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  good: {
    top: 18,
    left: 30,
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  zanteitaisaku: {
    top: 230,
    left: 110,
    fontSize: 15,
    fontWeight: "900",
    color: "white",
    // color: "white",
    // fontSize: 15,
  },
});

export default Favorites;
