
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ScrollView, TextInput } from "react-native";
import { Svg, Polygon } from "react-native-svg";
import Swiper from "react-native-swiper";
import Modal from "react-native-modal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";

import { cards } from "../../data/cards";   // ダミーデータ (YOLP API使用予定)
import { RandomCards, TouchCards } from "../../data/globals";

type Props = {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
  index: number;
  hasVisited: boolean | null;
  touchId: number;
  ramdomCards: RandomCards[] | null;
};

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const SERVER_URL = "https://o49zrrdot8.execute-api.us-east-1.amazonaws.com/tokitabi";

const Detail: React.FC<Props> = memo(({ page, setPage, index, hasVisited, touchId, ramdomCards }) => {

    const [showText, setShowText] = useState(hasVisited);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputText, setInputElement] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState("");
    const [touchData, setTouchData] = useState<TouchCards>();
    // const [pressedTime, setPressedTime] = useState<string | null>(null);

    console.log(touchData);
    

    const handleButtonPress = () => {
      setShowText((prevShowText) => !prevShowText);
    };
    const toggleModal = () => {
      setIsModalVisible((prevState) => !prevState);
    };

    const handleEditButtonClick = () => {
      setInputElement(text);
      setIsEditing(true);
    };

    const handleSaveButtonClick = () => {
      setIsEditing(false);
      setText(inputText); // テキストを保存する場合はここで値を更新する
      const currentTime = new Date().toLocaleString();
      // setPressedTime(currentTime);
    };

    useEffect(() => {
      (async () => {
        const getFavoriteAllData = await fetch(`${SERVER_URL}/api/favorites/all/test`).then(data => data.json());
        getFavoriteAllData.forEach((data: TouchCards) => data.id === touchId && setTouchData(data));
      })()
    }, []);

  return (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (page === "detail") {
            setPage("home");
          } else if (page === "visited") {
            setPage("spots");
          } else if (page === "fromMap") {
            setPage("map");
          }
        }}
      >
        <EvilIcon name="chevron-left" style={styles.backIcon} />
      </TouchableOpacity>
      {page !== "detail" && (
        <>
          {/* {text === "" && (
            <Icon name="chatbox-outline" style={styles.noCommentIcon} />
          )} */}
          {text !== "" && (
            <TouchableOpacity onPress={toggleModal} style={styles.checkCommentButton}>
              <Icon name="chatbox-ellipses" style={styles.checkCommentIcon} />
              <Text style={{ color: "#9e1b1b", fontSize: 7, textAlign: "center" }}>
                メモあり
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <ScrollView>
      { page === "detail" &&
        <View style={ page !== "detail" && { paddingBottom: 80 } }>
          {/* 行ったよラベルを表示させる */}
          {showText === true && (
            <View style={styles.window}>
              <Svg width={500} height={500}>
                <Polygon points="0,150 150,0 150,150" fill="rgb(158, 27, 27)" />
                <View style={styles.visitedTextContainer}>
                  <Text style={styles.visitedText}>行ったよ！ </Text>
                </View>
              </Svg>
            </View>
          )}
          <View style={styles.cardPhoto}>
            <Swiper
              // showsButtons={cards[index].images.length !== 1 && true}
              showsButtons={ramdomCards !== null && ramdomCards[index].images.length !== 1 && true}
              autoplay={true}
              activeDotColor={"rgb(158, 27, 27)"}
              nextButton={
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 50 }}>›</Text>
              }
              prevButton={
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 50 }}>‹</Text>
              }
            >
              {/* {cards[index].images.map((item, index) => ( */}
              {ramdomCards && ramdomCards[index].images.map((item, index) => (
                <View key={index}>
                  <Image
                    style={{ width: ScreenWidth, height: 350 }}
                    source={{ uri: item }}
                  />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={styles.description}>
            <Text style={styles.title}>{ramdomCards && ramdomCards[index].name}</Text>
            {/* <Text style={styles.title}>{cards[index].name}</Text> */}

            <View style={styles.addressContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="location-outline" style={styles.icon} />
                所在地
              </Text>
              <Text
                style={styles.descriptionPostCode}
              >{`〒${ramdomCards && ramdomCards[index].zip_code}`}</Text>
              {/* >{`〒${cards[index].zip_code}`}</Text> */}
              <Text style={styles.descriptionText}>{ramdomCards && ramdomCards[index].address}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].address}</Text> */}
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="cash-outline" style={styles.icon} /> 料金
              </Text>
              <Text
                style={styles.descriptionText}
              >{`${ramdomCards && ramdomCards[index].price}円`}</Text>
              {/* >{`${cards[index].price}円`}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="time-outline" style={styles.icon} /> 営業日･時間
              </Text>
              <Text style={styles.descriptionText}>
                {ramdomCards && ramdomCards[index].business}
                {/* {cards[index].business} */}
              </Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="call-outline" style={styles.icon} /> 電話番号
              </Text>
              <Text style={styles.descriptionText}>
                {ramdomCards && ramdomCards[index].phone_number}
                {/* {cards[index].phone_number} */}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <MaterialCommunityIcons
                  name="alpha-p-circle-outline"
                  style={styles.icon}
                />{" "}
                駐車場
              </Text>
              <Text style={styles.descriptionTextParking}>
                {ramdomCards && ramdomCards[index].parking}
                {/* {cards[index].parking} */}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <MaterialCommunityIcons
                  name="human-male-female"
                  style={styles.icon}
                />
                トイレ
              </Text>
              <Text style={styles.descriptionText}>{ramdomCards && ramdomCards[index].toilet}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].toilet}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="information-circle-outline" style={styles.icon} />{" "}
                定休日
              </Text>
              <Text style={styles.descriptionText}>{ramdomCards && ramdomCards[index].closed}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].closed}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="subway-outline" style={styles.icon} />{" "}
                公共交通機関でのアクセス
              </Text>
              {/* {cards[index].public_transport.map((item, itemIndex) => ( */}
              {ramdomCards && ramdomCards[index].public_transport.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.descriptionTextList}>
                  {item}
                </Text>
              ))}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="car-outline" style={styles.icon} /> 車でのアクセス
              </Text>
              {/* {cards[index].car.map((item, itemIndex) => ( */}
              {ramdomCards && ramdomCards[index].car.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.descriptionTextList}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        </View>
      }
      { page !== "detail" && touchData &&
        <View style={ page !== "detail" && { paddingBottom: 80 } }>
          {/* 行ったよラベルを表示させる */}
          {showText === true && (
            <View style={styles.window}>
              <Svg width={500} height={500}>
                <Polygon points="0,150 150,0 150,150" fill="rgb(158, 27, 27)" />
                <View style={styles.visitedTextContainer}>
                  <Text style={styles.visitedText}>行ったよ！ </Text>
                </View>
              </Svg>
            </View>
          )}
          <View style={styles.cardPhoto}>
            <Swiper
              // showsButtons={cards[index].images.length !== 1 && true}
              showsButtons={touchData.images.length !== 1 && true}
              autoplay={true}
              activeDotColor={"rgb(158, 27, 27)"}
              nextButton={
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 50 }}>›</Text>
              }
              prevButton={
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 50 }}>‹</Text>
              }
            >
              {/* {cards[index].images.map((item, index) => ( */}
              {touchData.images.map((item, index) => (
                <View key={index}>
                  <Image
                    style={{ width: ScreenWidth, height: 350 }}
                    source={{ uri: item }}
                  />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={styles.description}>
            <Text style={styles.title}>{touchData.name}</Text>
            {/* <Text style={styles.title}>{cards[index].name}</Text> */}

            <View style={styles.addressContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="location-outline" style={styles.icon} />
                所在地
              </Text>
              <Text
                style={styles.descriptionPostCode}
              >{`〒${touchData.zip_code}`}</Text>
              {/* >{`〒${cards[index].zip_code}`}</Text> */}
              <Text style={styles.descriptionText}>{touchData.address}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].address}</Text> */}
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="cash-outline" style={styles.icon} /> 料金
              </Text>
              <Text
                style={styles.descriptionText}
              >{`${touchData.price}円`}</Text>
              {/* >{`${cards[index].price}円`}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="time-outline" style={styles.icon} /> 営業日･時間
              </Text>
              <Text style={styles.descriptionText}>
                {touchData.business}
                {/* {cards[index].business} */}
              </Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="call-outline" style={styles.icon} /> 電話番号
              </Text>
              <Text style={styles.descriptionText}>
                {touchData.phone_number}
                {/* {cards[index].phone_number} */}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <MaterialCommunityIcons
                  name="alpha-p-circle-outline"
                  style={styles.icon}
                />{" "}
                駐車場
              </Text>
              <Text style={styles.descriptionTextParking}>
                {touchData.parking}
                {/* {cards[index].parking} */}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <MaterialCommunityIcons
                  name="human-male-female"
                  style={styles.icon}
                />
                トイレ
              </Text>
              <Text style={styles.descriptionText}>{touchData.toilet}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].toilet}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="information-circle-outline" style={styles.icon} />{" "}
                定休日
              </Text>
              <Text style={styles.descriptionText}>{touchData.closed}</Text>
              {/* <Text style={styles.descriptionText}>{cards[index].closed}</Text> */}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="subway-outline" style={styles.icon} />{" "}
                公共交通機関でのアクセス
              </Text>
              {/* {cards[index].public_transport.map((item, itemIndex) => ( */}
              {touchData.public_transport.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.descriptionTextList}>
                  {item}
                </Text>
              ))}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>
                <Icon name="car-outline" style={styles.icon} /> 車でのアクセス
              </Text>
              {/* {cards[index].car.map((item, itemIndex) => ( */}
              {touchData.car.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.descriptionTextList}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        </View>
      }
      </ScrollView>
        {page !== "detail" && (
          <>
            <View style={styles.container}>
              <View style={styles.footer}>
                {/* コメント編集画面 */}
                <TouchableOpacity onPress={toggleModal}>
                  <FontAwesome name="pencil" style={styles.penIcon} />
                </TouchableOpacity>
                <Modal isVisible={isModalVisible}>
                  {/* Modalの配置設定 */}
                  <TouchableOpacity activeOpacity={1} onPressOut={toggleModal}>
                    <View
                      style={{
                        flex: 1,
                        marginBottom: "100%",
                        alignItems: "center",
                        backgroundColor: "#fff",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                          style={styles.backCommentButton}
                          onPress={toggleModal}
                        >
                          <EvilIcon
                            name="chevron-left"
                            style={styles.backIcon}
                          />
                        </TouchableOpacity>
                        {/* 初期画面 */}
                        {isEditing === false && text === "" && (
                          <TextInput
                            value={inputText}
                            onChangeText={setInputElement}
                            placeholder="📝メモがあれば記入してね！"
                            style={styles.commentTextContainer}
                          />
                        )}
                        {/* 登録後の画面 */}
                        {isEditing === false && text !== "" && (
                          <>
                            <View style={styles.savedCommentTextContainer}>
                              <Text style={styles.savedCommentText}>
                                {text}
                              </Text>
                            </View>
                            {/* {pressedTime && (
                            <Text>メモ登録日：{pressedTime}</Text>
                          )} */}
                          </>
                        )}
                        {/* 編集中の画面 */}
                        {isEditing === true && (
                          <TextInput
                            value={inputText}
                            onChangeText={setInputElement}
                            style={styles.commentTextContainer}
                          />
                        )}
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditButtonClick}
                          >
                            <Text style={styles.editButtonText}>編集</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.savedButton}
                            onPress={handleSaveButtonClick}
                          >
                            <Text style={styles.text}>登録</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
                {/* 行ったよボタン */}
                <TouchableOpacity
                  style={[styles.button, showText && styles.buttonPressed]}
                  onPress={async () => {
                    console.log("patched", touchId);
                    handleButtonPress();
                    await fetch(`${SERVER_URL}/api/favorites/${touchId}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(touchId),
                    });
                  }}
                >
                  <Text style={[styles.text, showText && styles.textPressed]}>
                    行ったよ！
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 55,
    left: 15,
    height: 30,
    width: 30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 35,
    left: -2,
    top: 1,
    color: "rgb(80, 80, 80)",
  },
  cardPhoto: {
    height: 350,
  },
  description: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
  },
  addressContainer: {
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "rgb(230, 230, 230)",
  },
  descriptionTitle: {
    fontSize: 23,
    paddingBottom: 5,
    paddingLeft: 3,
    color: "rgb(80, 80, 80)",
  },

  descriptionContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "rgb(230, 230, 230)",
  },
  icon: {
    fontSize: 25,
    color: "rgb(80, 80, 80)",
    fontWeight: "bold",
  },
  descriptionPostCode: {
    paddingLeft: 5,
    paddingBottom: 3,
    color: "rgb(100, 100, 100)",
  },
  descriptionText: {
    fontSize: 20,
    paddingLeft: 5,
    color: "rgb(100, 100, 100)",
  },
  descriptionTextParking: {
    fontSize: 17,
    paddingLeft: 5,
    color: "rgb(100, 100, 100)",
  },
  descriptionTextList: {
    fontSize: 15,
    color: "rgb(100, 100, 100)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 9999,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingBottom: 27,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "rgb(230, 230, 230)",
  },
  penIcon: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 28,
    color: "#9e1b1b",
    fontWeight: "bold",
  },
  button: {
    width: 120,
    height: 40,
    backgroundColor: "#9e1b1b",
    marginLeft: 180,
    marginTop: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(158, 27, 27, 0.1)",
    shadowColor: "#9e1b1b",
    shadowOffset: {
      width: 0.5,
      height: 0,
    },
    shadowOpacity: 0.5,
  },

  descriptionAddress: {},
  text: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
  },
  textPressed: {
    fontSize: 13,
    color: "#9e1b1b",
    fontWeight: "bold",
  },
  visitedTextContainer: {
    position: "absolute",
    bottom: -100,
    right: 365,
    alignItems: "center",
    transform: [{ rotate: "315deg" }],
  },
  visitedText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  window: {
    position: "absolute",
    top: 200,
    left: 250,
    zIndex: 999,
  },
  commentTextContainer: {
    marginTop: "15%",
    fontSize: 20,
    // borderWidth: 1,
    borderColor: "#9e1b1b",
    height: 150,
    width: 300,
    alignContent: "center",
    backgroundColor: "#ffd9d4",
    borderRadius: 10,
  },
  editButton: {
    width: 120,
    height: 40,
    backgroundColor: "#ffd9d4",
    marginTop: 20,
    marginRight: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#9e1b1b",
  },
  savedCommentTextContainer: {
    marginTop: "15%",
    fontSize: 20,
    borderWidth: 3,
    borderColor: "#9e1b1b",
    height: 150,
    width: 300,
    alignContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  savedButton: {
    width: 120,
    height: 40,
    backgroundColor: "#9e1b1b",
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  savedCommentText: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    color: "#9e1b1b",
    fontSize: 25,
  },
  noCommentIcon: {
    position: "absolute",
    color: "#9e1b1b",
    fontSize: 30,
    marginTop: 55,
    marginLeft: 330,
    height: 50,
    width: 50,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0)",
  },
  checkCommentButton: {
    flexDirection: "column",
    position: "absolute",
    zIndex: 1,
    height: 50,
    width: 50,
    marginTop: 50,
    marginLeft: 320,
    backgroundColor: "#ffd9d4",
    borderRadius: 25,
  },
  checkCommentIcon: {
    textAlign: "center",
    // position: "absolute",
    color: "#9e1b1b",
    marginTop: 3,
    fontSize: 30,
  },
  backCommentButton: {
    position: "absolute",
    left: 0,
    height: 30,
    width: 30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 20,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
});

export default Detail;
