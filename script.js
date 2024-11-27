// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, push, set,onValue, child, get,update} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDTb1xif-2j4GUnbC_r5sBx0nWtVJHpUg",
  authDomain: "fruits-catching-game.firebaseapp.com",
  projectId: "fruits-catching-game",
  storageBucket: "fruits-catching-game.appspot.com",
  messagingSenderId: "989941638117",
  appId: "1:989941638117:web:36349ce49fb579a515050c",
  measurementId: "G-28SL8WW952"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
// Reference to the 'users_details' node and insert data one by one


var final_result=[];

function showScoreRecords(table){
    final_result=[];
    const usersRefNormalGame = ref(database,table);
    // // Listen for changes and retrieve data
    onValue(usersRefNormalGame, (snapshot) => {
        // The snapshot.val() contains the inserted data
        const userData = snapshot.val();
        // console.log(userData);
        // console.log(userData['jagan2002']);
        for (const key in userData) {
            final_result.push({'key':key},userData[key]);
            objectAscOrder(final_result);
        }
        endGame(`NoCall`)
    });
}



function objectAscOrder(object){
    // object.sort(function(a, b) {
    //     return a.score - b.score;
    // });

    // // If scores are equal, sort based on 'missed' in ascending order
    // object.sort(function(a, b) {
    // if (a.score === b.score) {
    //     return a.missed - b.missed;
    // }
    //     return 0;
    // });
    // Sort the array based on 'score' in descending order and 'missed' in ascending order
    object.sort((a, b) => {
        // Sort by score in descending order
        if (b.score !== a.score) {
        return b.score - a.score;
        }
    
        // If scores are equal, sort by missed in ascending order
        return a.missed - b.missed;
    });
    return object;
}

// Function to retrieve data by key
async function getDataByKey(key,table) {
    const usersRef = ref(database, table);
  const userKeyRef = child(usersRef, key);
  try {
    const snapshot = await get(userKeyRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData;
    } else {
        //  console.log('No data found for key:', key);
      return null; // Indicate that no data was found
    }
  } catch (error) {
        // console.error('Error getting data:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

// Function to update data by key
function updateDataByKey(key,table,newData) {
    const usersRef = ref(database, table);
    const userKeyRef =  child(usersRef, key);
    // Set the data with merge option to update only specified fields
    update(userKeyRef, newData, { merge: true }).then(() => {
        // console.log('Data updated successfully for key:', key);
    }).catch((error) => {
        // console.error('Error updating data:', error);
    });
}
  
// Example usage
// updateDataByKey(sessionStorage.getItem('email'), {level: 5,name:'jagan',feedback:''});

$('.menu_fields,.game_level_list,.game_score_button,#container,.contoler_button,.game_help_container,.game_about_container,#loading_screen').hide();
if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
    $('#game_login').hide();
}
var balls = Array.from(document.querySelectorAll('.ball'));
const header = document.getElementById('header');
const missedFood = document.getElementById('missedfood');
const catcher = document.getElementById('catcher');
const total_score = document.getElementById('result');
const layer = document.getElementById('layer');
const scoreElem = document.getElementById('score');
const gameArea = document.getElementById('gameArea');
const start_restart_game = document.getElementById('start_restart_game');
var game_sound = document.getElementById("game_sound"); 
let score = 0;
let animationId='';
let moveLeft = false;
let moveRight = false;
let showBalls=true;
let catcherSpeed = 5;
let missedFoods = 0;
let catche_thief=0;
let ball_speed=20;
var game_countdown=5;
let start_game_status=true;
let GameLevel=1;
let gameLevelStatus=0;
let CountDown_start_game=0;
let increase_score=0;
var increase_speed_normal=0.10;
var increase_speed_level=0.10;
var catch_fruits_count=0;
let ballPosition=0;
let user_details='';
var game_level_details=[{
    rule_level_1:'Your goal is to reach a score of 100 without catching the thief more than five times.',
    rule_level_2:'Your goal is to reach a score of 200 without catching the thief more than four times and without missing more than 50 foods.',
    rule_level_3:'Your goal is to reach a score of 300 without catching the thief more than three times and without missing more than 60 foods.',
    rule_level_4:'Your goal is to reach a score of 400 without catching the thief more than two times and without missing more than 70 foods.',
    rule_level_5:'Your goal is to reach a score of 500 without catching the thief more than one times and without missing more than 100 foods.',
    rule_level_6:'Your goal is to reach a score of 600 without catching the thief more than one times and without missing more than 150 foods.',        
    rule_level_7:'Your goal is to reach a score of 700 without catching the thief more than one times and without missing more than 190 foods.',
    rule_level_8:'Your goal is to reach a score of 800 without catching the thief more than one times and without missing more than 220 foods.',
    rule_level_9:'Your goal is to reach a score of 900 without catching the thief more than one times and without missing more than 250 foods.',
    rule_level_10:'Your goal is to reach a score of 1000 without catching the thief more than one times and without missing more than 290 foods.',
    missing_1:0,missing_2:50,missing_3:60,missing_4:70,missing_5:100,missing_6:150,missing_7:190,missing_8:220,missing_9:250,missing_10:290,
    catch_thief_1:5,catch_thief_2:4,catch_thief_3:3,catch_thief_4:2,catch_thief_5:1,catch_thief_6:1,catch_thief_7:1,catch_thief_8:1,catch_thief_9:1,catch_thief_10:1,
    score_1:100,score_2:200,score_3:300,score_4:400,score_5:500,score_6:600,score_7:700,score_8:800,score_9:900,score_10:1000,
    catch_fruits_1:20,catch_fruits_2:30,catch_fruits_3:40,catch_fruits_4:50,catch_fruits_5:60,catch_fruits_6:70,catch_fruits_7:80,catch_fruits_8:90,catch_fruits_9:100,catch_fruits_10:110,
}]

// https://i.postimg.cc/RFd67kzS/dairy-milk-oreo.png
var changeUI=[{
    level_1:{
        image1:{src:'https://i.postimg.cc/VvsfDmYC/orange.png',width:50,height:50},
        image2:{src:'https://i.postimg.cc/bNjHY5m2/Apple.png',width:50,height:50},
        image3:{src:'https://i.postimg.cc/QtfGN53F/Strawberry.png',width:50,height:70},
        image4:'https://i.postimg.cc/BQT2MyMB/colorful-fruit.jpg',
        image5:'https://i.postimg.cc/qvDj0SyH/fruit-Shop.jpg',
        image6:{src:'https://i.postimg.cc/Bbjzf37y/pynappel.png',width:50,height:100},
        image7:{src:'https://i.postimg.cc/QxrCtMhj/grape.png',width:50,height:50},
        image8:{src:'https://i.postimg.cc/j2bgWfMH/banana.png',width:50,height:50},
    },
    level_2:{
        image1:{src:'https://i.postimg.cc/MGy0pt06/1705263700959.png',width:50,height:50},
        image2:{src:'https://i.postimg.cc/nLY7JrZM/1705263700975.png',width:50,height:50},
        image3:{src:'https://i.postimg.cc/fy6kXQZ6/1705263701007.png',width:50,height:50},
        image4:'https://i.postimg.cc/PxcbcSyn/various-cookies-candy.jpg',
        image5:'https://i.postimg.cc/WzJgxn4c/1705263701023.png',
        image6:{src:'https://i.postimg.cc/vHr69Dgh/1705263700943.png',width:50,height:50},
        image7:{src:'https://i.postimg.cc/NfDjBX23/1705263700990.png',width:50,height:50},
        image8:{src:'https://i.postimg.cc/5NCt8rzj/buscuit.png',width:50,height:50},
    },
    level_3:{
        image1:{src:'https://i.postimg.cc/J0ftQMtk/5star.png',width:35,height:70},
        image2:{src:'https://i.postimg.cc/XJMNZ31G/kit-kat.png',width:35,height:70},
        image3:{src:'https://i.postimg.cc/K8LHG2Ts/milky-bar.png',width:35,height:70},
        image4:'https://i.postimg.cc/qRGkm7dP/chocolate-pieces-truffles.jpg',
        image5:'https://i.postimg.cc/sg7Gw6Fh/chocolate-shop.jpg',
        image6:{src:'https://i.postimg.cc/Tw10WqZ4/dairy-mike-silk-heart.png',width:35,height:70},
        image7:{src:'https://i.postimg.cc/RFd67kzS/dairy-milk-oreo.png',width:35,height:70},
        image8:{src:'https://i.postimg.cc/4dfM29j6/dairy-mike-silk.png',width:35,height:70},
    },
    level_4:{
        image1:{src:'https://i.postimg.cc/zD4vLs31/cake1.png',width:40,height:60},
        image2:{src:'https://i.postimg.cc/1X3ds7hC/cake4.png',width:40,height:60},
        image3:{src:'https://i.postimg.cc/SNdmqH04/cake5.png',width:40,height:60},
        image4:'https://i.postimg.cc/RFQvhZsP/assortment-pieces-cake.jpg',
        image5:'https://i.postimg.cc/ZKSDjqMY/cake-shop.jpg',
        image6:{src:'https://i.postimg.cc/fLYF8hz9/cake6.png',width:50,height:50},
        image7:{src:'https://i.postimg.cc/BnGp4w0q/cake2.png',width:50,height:50},
        image8:{src:'https://i.postimg.cc/DZqykZdf/cake3.png',width:50,height:50},
    },
    level_5:{
        image1:{src:'https://i.postimg.cc/pdMNjtn3/footi.png',width:40,height:60},
        image2:{src:'https://i.postimg.cc/jjc8jV6H/real-fruit-power.png',width:40,height:70},
        image3:{src:'https://i.postimg.cc/3R4k6cP4/paper-boat.png',width:35,height:70},
        image4:'https://i.postimg.cc/mg02kqw5/fresh.jpg',
        image5:'https://i.postimg.cc/vHRfVqZC/juice-shop.jpg',
        image6:{src:'https://i.postimg.cc/j5q3Kzsr/maaza.png',width:35,height:70},
        image7:{src:'https://i.postimg.cc/d1qQYSkt/bovonto.png',width:35,height:90},
        image8:{src:'https://i.postimg.cc/y8MXv0JT/7up.png',width:35,height:90},
    },
    level_6:{
        image1:{src:'https://i.postimg.cc/C123QBSs/onion.png',width:50,height:50},
        image2:{src:'https://i.postimg.cc/cCQzSFm2/veg1.png',width:50,height:75},
        image3:{src:'https://i.postimg.cc/htqrc9r3/veg2.jpg',width:50,height:75},
        image4:'https://i.postimg.cc/pXbkHQ3Y/colorful-veggies.jpg',
        image5:'https://i.postimg.cc/DwfVPKvN/vegetable-shop.jpg',
        image6:{src:'https://i.postimg.cc/nz22w6xK/potato.png',width:50,height:50},
        image7:{src:'https://i.postimg.cc/rp12zFG8/thangali.png',width:50,height:50},
        image8:{src:'https://i.postimg.cc/2SCKTFnf/karat.png',width:35,height:70},
    },
    level_7:{
        image1:{src:'https://i.postimg.cc/1RBXZJZy/lays-red.png',width:60,height:70},
        image2:{src:'https://i.postimg.cc/X7VbnbkP/lays-blue.png',width:60,height:70},
        image3:{src:'https://i.postimg.cc/XJHwX3yg/lays-green.png',width:60,height:70},
        image4:'https://i.postimg.cc/BQT2MyMB/colorful-fruit.jpg',
        image5:'https://i.postimg.cc/sfBLcWLJ/lays-shop.png',
        image6:{src:'https://i.postimg.cc/Hskgdnvc/bingo.png',width:60,height:70},
        image7:{src:'https://i.postimg.cc/sx4ygZ7q/kurkure.png',width:60,height:70},
        image8:{src:'https://i.postimg.cc/0QCgDKys/tedhe.png',width:60,height:70},
    },
    level_8:{
        image1:{src:'https://i.postimg.cc/xjH1b59B/ice-cream-4.png',width:35,height:70},
        image2:{src:'https://i.postimg.cc/bNCWYXKP/ice-cream-6.png',width:35,height:70},
        image3:{src:'https://i.postimg.cc/59FSYhY1/ice-cream-7.png',width:35,height:70},
        image4:'https://i.postimg.cc/PxcbcSyn/various-cookies-candy.jpg',
        image5:'https://i.postimg.cc/MT6vYjt1/ice-cream-shop.png',
        image6:{src:'https://i.postimg.cc/sgSp17vc/ice-cream-2.png',width:35,height:70},
        image7:{src:'https://i.postimg.cc/FFy16v7T/ice-cream-3.png',width:35,height:70},
        image8:{src:'https://i.postimg.cc/wT1ZvqLV/ice-cream-5.png',width:35,height:70},
    },
    level_9:{
        image1:{src:'https://i.postimg.cc/wBS8HQXc/pizza.png',width:80,height:50},
        image2:{src:'https://i.postimg.cc/G2qFGqXv/hotdog.png',width:80,height:50},
        image3:{src:'https://i.postimg.cc/CKvCfcPk/burritos.png',width:50,height:70},
        image4:'https://i.postimg.cc/qRGkm7dP/chocolate-pieces-truffles.jpg',
        image5:'https://i.postimg.cc/5yrtMC2h/fast-food-shop.jpg',
        image6:{src:'https://i.postimg.cc/sDV2t3Df/hamburger.png',width:80,height:70},
        image7:{src:'https://i.postimg.cc/fT3PW9b8/fires.png',width:50,height:70},
        image8:{src:'https://i.postimg.cc/Z54D8DcM/taco.png',width:50,height:70},
    },
    level_10:{
        image1:{src:'https://i.postimg.cc/zD4vLs31/cake1.png',width:40,height:60},
        image2:{src:'https://i.postimg.cc/1X3ds7hC/cake4.png',width:40,height:60},
        image3:{src:'https://i.postimg.cc/SNdmqH04/cake5.png',width:40,height:60},
        image4:'https://i.postimg.cc/RFQvhZsP/assortment-pieces-cake.jpg',
        image5:'https://i.postimg.cc/ZKSDjqMY/cake-shop.jpg',
        image6:{src:'https://i.postimg.cc/fLYF8hz9/cake6.png',width:50,height:50},
        image7:{src:'https://i.postimg.cc/BnGp4w0q/cake2.png',width:50,height:50},
        image8:{src:'https://i.postimg.cc/DZqykZdf/cake3.png',width:50,height:50},
    },
}]
let emoji='',resultMessage='';
var normal_game_level=1;
var randowm_food_src='';
var food_width='';
var food_height='';
$('.layeout').hide();
var randomly_show_fruit=0,add_fruit=true,increase_speed=0;
function dropBall() {
    if (moveLeft && catcher.offsetLeft > 0) {
        catcher.style.left = (catcher.offsetLeft - catcherSpeed) + 'px';
    }
    if (moveRight && catcher.offsetLeft < gameArea.clientWidth - catcher.clientWidth) {
        catcher.style.left = (catcher.offsetLeft + catcherSpeed) + 'px';
    }
    if(randomly_show_fruit==35 && add_fruit){
        if(gameLevelStatus==1){
            randowm_food_src=changeUI[0]['level_'+GameLevel]['image6']['src'];
            food_width=changeUI[0]['level_'+GameLevel]['image6']['width'];
            food_height=changeUI[0]['level_'+GameLevel]['image6']['height'];
        }else{
            randowm_food_src=changeUI[0]['level_'+normal_game_level]['image6']['src'];
            food_width=changeUI[0]['level_'+normal_game_level]['image6']['width'];
            food_height=changeUI[0]['level_'+normal_game_level]['image6']['height'];
        }
        console.log(randowm_food_src);
        $('#gameArea').append(`<div class="ball new_fruit" point="10" sub_id="ball6">
        <img id="ball6" src="${randowm_food_src}" width="${food_width}"  height="${food_height}" alt="" srcset=""/>	
        <span>+10</span>
    </div>`);
        randomly_show_fruit=0;
    }else if(randomly_show_fruit==20 && add_fruit){
        if(gameLevelStatus==1){
            randowm_food_src=changeUI[0]['level_'+GameLevel]['image7']['src'];
            food_width=changeUI[0]['level_'+GameLevel]['image7']['width'];
            food_height=changeUI[0]['level_'+GameLevel]['image7']['height'];
        }else{
            randowm_food_src=changeUI[0]['level_'+normal_game_level]['image7']['src'];
            food_width=changeUI[0]['level_'+normal_game_level]['image7']['width'];
            food_height=changeUI[0]['level_'+normal_game_level]['image7']['height'];
        }
        console.log(randowm_food_src);
        $('#gameArea').append(`<div class="ball new_fruit" point="5" sub_id="ball6">
        <img id="ball6" src="${randowm_food_src}" width="${food_width}"  height="${food_height}" alt="" srcset=""/>	
        <span>+5</span>
    </div>`);
    add_fruit=false;
    }else if(randomly_show_fruit==10 && add_fruit){
        if(gameLevelStatus==1){
            randowm_food_src=changeUI[0]['level_'+GameLevel]['image8']['src'];
            food_width=changeUI[0]['level_'+GameLevel]['image8']['width'];
            food_height=changeUI[0]['level_'+GameLevel]['image8']['height'];
        }else{
            randowm_food_src=changeUI[0]['level_'+normal_game_level]['image8']['src'];
            food_width=changeUI[0]['level_'+normal_game_level]['image8']['width'];
            food_height=changeUI[0]['level_'+normal_game_level]['image8']['height'];
        }
        add_fruit=false;
        $('#gameArea').append(`<div class="ball new_fruit" point="4" sub_id="ball6">
        <img id="ball6" src="${randowm_food_src}" width="${food_width}"  height="${food_height}" alt="" srcset=""/>	
        <span>+4</span>
    </div>`);
    }
    balls = Array.from(document.querySelectorAll('.ball'));
    balls.forEach((ball, index) => {
        if(showBalls==true){
            increase_score=parseInt(ball.attributes.point.value);
            if(gameLevelStatus==0){
                ballPosition = ball.offsetTop+(2+increase_speed_normal);
            }else if(gameLevelStatus==1){
                ballPosition = ball.offsetTop+(2+increase_speed_level);
            }
            var rand_top=generateRandomNumbersWithExclusion(30, 50, 70);
            if(ballPosition>rand_top && ball.classList.contains('big')){
                ballPosition=ballPosition-generateRandomNumbersWithExclusion(30, 50, 70);
            }
            // console.log('ballPosition :',ballPosition);
            ball.style.top = ballPosition + 'px';
            ball.style.display = 'block';
            if (ballPosition + 30 >= catcher.offsetTop && ballPosition <= catcher.offsetTop + 10) {
                if (ball.offsetLeft + 15 > catcher.offsetLeft && ball.offsetLeft + 15 < catcher.offsetLeft + catcher.clientWidth) {
                    if (ballPosition <= gameArea.clientHeight-30) {
                        increase_speed++;
                        if (ball.classList.contains('big')) {
                            catche_thief++;
                            score=(score>5)?(score-5):0;
                            if ((catche_thief == game_level_details[0]['catch_thief_'+GameLevel] && gameLevelStatus==1) || (catche_thief ==3 && gameLevelStatus==0)) {
                                updateScore();
                                updatemissedFruits();
                                clearTimeout(animationId);
                                endGame(`thief`);
                                showBalls=false;
                                return false; 
                            }
                        }else{
                            score=increase_score+score;
                            catch_fruits_count++
                            if(gameLevelStatus==0){
                                if(score>=game_level_details[0]['score_'+normal_game_level]){
                                    normal_game_level++;                    
                                    setthemes(normal_game_level);
                                }
                        if(catch_fruits_count==game_level_details[0]['catch_fruits_'+normal_game_level]){
                                    increase_speed_normal=increase_speed_normal+0.10;
                                    catch_fruits_count=0;
                                }
                            }else if(gameLevelStatus==1){
                                if(catch_fruits_count==game_level_details[0]['catch_fruits_'+GameLevel]){
                                    increase_speed_level=increase_speed_level+0.10;
                                    catch_fruits_count=0;
                                }  
                            }
                        }
                        catcher.style.transform = 'scale(1.2)'; 
                        catcher.style.opacity = '0.7';
                        setTimeout(() => {
                        catcher.style.transform = 'scale(1)';  
                        catcher.style.opacity = '1';
                        }, 150);
                        scoreElem.textContent = "Score: " + score;
                        resetBall(ball);
                        if (!ball.classList.contains('big')) {
                            if(!ball.classList.contains('new_fruit')){
                                randomly_show_fruit++;
                                add_fruit=true;
                            }
                        }
                        if(ball.classList.contains('new_fruit')){
                            $('.new_fruit').remove();
                        }
                        if(score>=game_level_details[0]['score_'+GameLevel] && gameLevelStatus==1){
                            updateScore();
                            updatemissedFruits();
                            clearTimeout(animationId);
                            endGame(``);
                            showBalls=false;
                            return false; 
                        }

                    }
                }
            }else if(ballPosition >= (gameArea.clientHeight-70)){
                if (!ball.classList.contains('big')) {
                    missedFoods++;
                    if(!ball.classList.contains('new_fruit')){
                        randomly_show_fruit++;
                        add_fruit=true;
                    }
                }
                increase_speed++;
                if(missedFoods==game_level_details[0]['missing_'+GameLevel] && game_level_details[0]['missing_'+GameLevel]!=0 && gameLevelStatus==1){
                    updateScore();
                    updatemissedFruits();
                    endGame(`missed`);
                    showBalls=false;
                    return false; 
                }else{
                    if(missedFoods==20 && gameLevelStatus==0){
                        updateScore();
                        updatemissedFruits();
                        endGame(`missed`);
                        showBalls=false;
                        return false; 
                    }
                }
                if(ball.classList.contains('new_fruit')){
                    $('.new_fruit').remove();
                }
                resetBall(ball);
            }

        }else{
            $('.ball').css({'display':'none'});
            resetBall(ball);
        }
    });
    animationId =setTimeout(dropBall,ball_speed);
}

function resetBall(ball) {
    // Check if ball has passed catcher and is not 'big'
    // missedFood.textContent='Missed: '+missedFoods;
    updateScore();
    updatemissedFruits();
    ball.style.top = '-30px';
    ball.style.display = 'none';
    console.log(ball.attributes.sub_id.value);
    var Ball_left=avoid_outside_fruit(ball,ball.attributes.sub_id.value);
    ball.style.left = Ball_left + 'px';
}

function startGame() {
   
    if(parseInt($('.setting_menu').attr('data-open_menu'))==0){
        $('#game_status').html('Started<br>'+game_countdown);
        $('.layeout').show();
        $('.play_game').hide();
        if(game_countdown>0){
            CountDown_start_game=setTimeout(startGame,1000);
            game_countdown--;
        }else{
            game_setting();
            game_countdown=5;
            $('.layeout').hide();
            $('.play_game,.game_score_button,#container,.contoler_button').show();
            game_sound.play();
            if(start_game_status==true){
                showBalls=true;
                balls.forEach((ball, index) => {
                    setTimeout(() => {
                        resetBall(ball);
                    }, index * 500);
                });
                dropBall();
                score = 0;
                missedFoods = 0;
                catche_thief=0;
                randomly_show_fruit=0;
                CountDown_start_game=0;
                increase_score=0;
                increase_speed_normal=0.10;
                increase_speed_level=0.10;
                catch_fruits_count=0;
                add_fruit=true,increase_speed=0;
                normal_game_level=1;
                if(gameLevelStatus==0){
                    setthemes(normal_game_level);
                }else{
                    setthemes(GameLevel);
                }
                updateScore();
                updatemissedFruits();
          $('.start_game_button,#title,.game_help_container,.game_about_container').hide();
            }else{
                clearTimeout(CountDown_start_game);
                dropBall();
            }
        }
    }
}

function endGame(type) {
    if(move_right){
        clearTimeout(move_right);
    }
    if(move_left){
        clearTimeout(move_left);
    }
    var message='',title='';
    game_sound.pause();
    game_sound.currentTime = 0;
    ball_speed=40;
    start_game_status=true;
    if(score>=100 && score<=200){
        emoji='&#129395;';
    }else if(score>=201 && score<=300){
        emoji='&#128526;';
    }else if(score>=301 && score<=400){
        emoji='&#128519;';
    }else if(score>=401 && score<=500){
        emoji='&#129312;';
    }else if(score>=501){
        emoji='&#129321;';
    }else if(score==0){
        emoji='&#128552;';
    }else{
        emoji='&#128512;';
    }
    var DenyButtonShow=false;
    var catch_thief_value=game_level_details[0]['catch_thief_'+GameLevel];
    var missed_value=game_level_details[0]['missing_'+GameLevel];
    var icon_value='success';
    var game_normal_records='';
    if(gameLevelStatus==1){
        if(catch_thief_value==catche_thief || missed_value==missedFoods){
            resultMessage=sessionStorage.getItem('name')+' Level '+GameLevel+' has not been finished. ';
            resultMessage+=(type=='thief')?' You caught the thief '+catch_thief_value+' times.':'Number of missed foods exceeds '+missed_value+'.'; 
        }else{
            if(GameLevel==10){
                var nextTitle='You have finished all levels. Would you like to play Level 1?';
            }else{
                var nextTitle='Are you ready to proceed to the next level?';
            }
            resultMessage=sessionStorage.getItem('name')+' Level '+GameLevel+' has been finished. '+nextTitle;
            DenyButtonShow=true;
            icon_value='success';
        }
        message='<p style="font-size:30px">'+emoji+'</p>'+resultMessage+"<br><span style='color:green;'>Your score is: " + score+'</span>';
      title='Game Over';
    }else if(gameLevelStatus==0){
        if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
          if(score>sessionStorage.getItem('score')){ 
            updateDataByKey(sessionStorage.getItem('email'),`game_normal`,{ score: score,missed:missedFoods });
          }
            icon_value='';
            if(type!='NoCall'){
                showScoreRecords(`game_normal`);
            }
            game_normal_records='<table style="font-size:14px;"class="table table-bordered table-hover" ><thead style="background:black;font-weight:bold;color:white;"><tr><th>Name</th><th>Missed</th><th>Score</th><th>Winner</th></thead><tbody>';
            if(final_result.length!=0){
                for(var i=0;i<10;i++){
                    if(final_result.length>i){
                        if(final_result[i]['score']!=0){
                            game_normal_records+='<tr><td style="text-transform:capitalize" title="'+final_result[i]['key']+'">'+final_result[i]['name']+'</td><td>'+final_result[i]['missed']+'</td><td>'+final_result[i]['score']+'</td><td>'+(i+1)+'</td>';
                        }
                    }
                }
            }
            game_normal_records+='</tbody></table>';
            message=game_normal_records;
            title='Score Board';
        }else{
            title='Game Over';
            resultMessage=(type=='thief' || type=='NoCall')?'You caught the thief '+catche_thief+' times.':'Number of missed foods exceeds '+missedFoods+'.'; 
            message=resultMessage+'<br> .Your socre is :'+score;
        }
    }
    swal.fire({
        icon:icon_value,
        title: title,
        html: message,
        confirmButtonText: "Play Again",
        allowOutsideClick:false,
        showDenyButton:DenyButtonShow,
        denyButtonText:'Level '+ (GameLevel+1),
    }).then((result) => {
        if (result.isConfirmed) {
            startGame();
        } else if (result.isDenied && gameLevelStatus==1) {
            if(GameLevel==10){
                GameLevel=1
            }else{
                GameLevel = GameLevel + 1;
            }
            if(sessionStorage.getItem('feedbackStatus')==null){
                if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
                    updateDataByKey(sessionStorage.getItem('email'),`users`, { level: GameLevel });
                    getDataByKey(sessionStorage.getItem('email'),`users`).then(userData => {
                        if (userData !== null) {
                            sessionStorage.setItem('feedbackStatus',1);
                            if(userData['feedback']==''){
                                User_Feedback(``);
                            }else if(userData['feedback']!=''){
                                User_Feedback(userData['feedback']);
                            }else{
                                Game_Level(GameLevel);
                            }
                        }else{
                            Game_Level(GameLevel);
                        }
                    });
                }else{
                   Game_Level(GameLevel);
                }
            }else{
                Game_Level(GameLevel);
            }
        }
    });
}

function updateScore() {
    if(gameLevelStatus==1){
        scoreElem.textContent = "Score: " + score+'/'+game_level_details[0]['score_'+GameLevel];
    }else{
        scoreElem.textContent = "Score: " + score;
    }
}

function updatemissedFruits() {
    if(gameLevelStatus==1){
        if(game_level_details[0]['missing_'+GameLevel]!=0){
            missedFood.textContent = 'Missed: ' + missedFoods+'/'+game_level_details[0]['missing_'+GameLevel];
        }else{
            missedFood.textContent = 'Missed: ' + missedFoods;
        }
        $('#catchedthief').text('Thief: ' + catche_thief+'/'+game_level_details[0]['catch_thief_'+GameLevel]);
    }else{
        missedFood.textContent = 'Missed: ' + missedFoods+'/'+20;
        $('#catchedthief').text('Thief: ' + catche_thief+'/'+3);
    }

}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'ArrowRight') moveRight = false;
});
let touchStartX = 0;

gameArea.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
});

gameArea.addEventListener('touchmove', function(e) {
    let touchEndX = e.touches[0].clientX;

    if (touchEndX < touchStartX) {
        moveLeft = true;
        moveRight = false;
    } else {
        moveRight = true;
        moveLeft = false;
    }

    touchStartX = touchEndX;
});

gameArea.addEventListener('touchend', function(e) {
    moveLeft = false;
    moveRight = false;
});

var catcher_left=$('#catcher').css('left'),move_left='',move_right='';
$(document).on('touchstart','.move_left',function(e){
    catcher_man_move_left();
})

$(document).on('touchend','.move_left',function(e){
    clearTimeout(move_left);

})


$(document).on('touchstart','.move_right',function(e){
    catcher_man_move_right();
})

$(document).on('touchend','.move_right',function(e){
    clearTimeout(move_right);
})


function catcher_man_move_right(){
   if(move_left){
     clearTimeout(move_left);
   }
  catcher_left=parseInt($('#catcher').css('left').replace('px',''));
    if(catcher_left<(parseInt($('#gameArea')[0].clientWidth)-parseInt($('#catcher')[0].clientWidth))){
        catcher_left=catcher_left+5;
        $('#catcher').css('left',catcher_left+'px');
    }
    move_right=setTimeout(()=>{
        catcher_man_move_right();
    },10);
}
function catcher_man_move_left(){
   if(move_right){
     clearTimeout(move_right);
   } catcher_left=parseInt($('#catcher').css('left').replace('px',''));
    if(catcher_left>0){
        catcher_left=catcher_left-5;
        $('#catcher').css('left',catcher_left+'px');
    }
    move_left=setTimeout(()=>{
        catcher_man_move_left();
    },10);
}

$(document).on('click','.pause_game',function(e){
   $('.play_game').show();
    $('.layeout').show();
    $('#game_status').text('Paused');
    $('.play_game').prop('disabled',false);
    $('.play_game').css({'z-index': '2','position': 'relative'});
    clearTimeout(animationId);
    game_sound.pause();
});
$(document).on('click','.play_game',function(e){
    $('.play_game').hide();
    $('.layeout').show();
    $('#game_status').text('Started');
    $('.play_game').css('display','none');
    $('.play_game').css({'z-index': '0','position': 'unset'});
    start_game_status=false;
    startGame();
});

function isValidEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function encodeEmail(email){
    return encodeURIComponent(email.split('@')[0]);
}
function play_game_now(){
    $('.play_game').show();
    $('.layeout').hide();
    swal.fire({
        icon:'info',
        allowOutsideClick:false,
          html:`<h2 style="text-align:center">Game Rules</h2>
        <ol class="mt-2" style="text-align:left">
        <li class="mb-2">If you catch the thief, then 5 points will be deducted from the score. </li>
        <li class="mb-2">Scores are awarded based on the type of foods. </li>
        <li class="mb-2">If you click the normal button, it is a normal game with no levels. In the game, if you catch the thief three times and miss 20 foods, the game will be over.</li>
        <li class="mb-2">If you click the level button, there are 10 levels, each with a different goal. You need to finish the goal to move to the next level.</li>
        </ol>`,
        confirmButtonText: "Normal",
        allowOutsideClick:false,
        showDenyButton:true,
        denyButtonText:'Level '+GameLevel,
        showCancelButton:true,
    }).then((result)=>{
        if (result.isConfirmed) {
            setthemes(1);
            startGame();
            $('.game_level_list').hide();
            getDataByKey(sessionStorage.getItem('email'),`game_normal`).then(userData => {
                console.log(userData);
                if(userData==undefined || userData==null || userData==''){
                    set(ref(database, 'game_normal/' +sessionStorage.getItem('email')), {
                        name:sessionStorage.getItem('name'),
                        score:0,
                        missed:0,
                        time:'',
                    });
                }
            });
        } else if (result.isDenied) {
            gameLevelStatus=1;
            Game_Level(GameLevel);
            getDataByKey(sessionStorage.getItem('email'),`game_level`).then(userData => {
                if(userData==undefined || userData==null || userData==''){
                    set(ref(database, 'game_level/' +sessionStorage.getItem('email')+'/level_'+GameLevel), {
   name:sessionStorage.getItem('name'),
                        'score': 0,
                        'missed': 0,
                        'time': '',
                    });
                }
            });
            $('.game_level_list').show();
            missedFood.textContent = 'Missed: ' + missedFoods+'/'+game_level_details[0]['missing_'+GameLevel];
            $('#catchedthief').text('Thief: ' + catche_thief+'/'+game_level_details[0]['catch_thief_'+GameLevel]);
            scoreElem.textContent = "Score: " + score+'/'+game_level_details[0]['score_'+GameLevel];
        }
    })
}


function avoid_outside_fruit(ball,ball_id){
    var ballWidth =30;
    var gap = 20;
    var marginLeftValue=30;
    if(ball.classList.contains('new_fruit')){
        marginLeftValue= gameArea.clientWidth - ballWidth - 2 * gap;
    }else if (ball.classList.contains('big')) {
        marginLeftValue= gameArea.clientWidth - ballWidth - 3 * gap;
    }else{
        marginLeftValue= gameArea.clientWidth - ballWidth - 10;
    }
    var Ball_left= Math.floor(Math.random() * marginLeftValue);
    if(Ball_left<30 || Ball_left>(gameArea.clientWidth-30)){
        return avoid_outside_fruit(ball);
    }else{
        return Ball_left;
    }
}
function Game_Level(GameLevel){
    swal.fire({
        icon:'info',
        title:'Game Level '+GameLevel,
        html:game_level_details[0]['rule_level_'+GameLevel],
      showCancelButton:true,
        allowOutsideClick:false,
        confirmButtonText:'Play Now',
    }).then((result)=>{
        if(result.isConfirmed){
            $('.game_level_list').show();
            missedFood.textContent = 'Missed: ' + missedFoods+'/'+game_level_details[0]['missing_'+GameLevel];
            $('#catchedthief').text('Thief: ' + catche_thief+'/'+game_level_details[0]['catch_thief_'+GameLevel]);
            scoreElem.textContent = "Score: " + score+'/'+game_level_details[0]['score_'+GameLevel];
          $('.play_game,#game_status').show();
          $('.layeout,#loading_screen').hide();
          startGame();
        }else{
          $('.play_game,#game_status').show();
          $('.layeout,#loading_screen').hide();
        }
    })
}

function User_Feedback(value){
    swal.fire({
        title:'<p style="font-size:20px">Share your feedback</p>',
        html:`<label class="text-start text-start mb-2 ml-2 mt-3" style="width: 95%;" for="user_feedback">Feedback :<textarea col="5" autocomplete="off" row="10" id="user_feedback" class="form-control mt-2" placeholder="Enter the feedback.">${value}</textarea>`,
        allowOutsideClick:false,
        preConfirm: () => {
            const user_feedback = document.getElementById('user_feedback').value;
            if (!user_feedback) {
              Swal.showValidationMessage('Please enter a feedback.');
            }
            return { user_feedback };
          }
    }).then((result) => {
      if (result.isConfirmed) {
        const {user_feedback} = result.value;
        $('.play_game,#game_status').hide();
        $('.layeout,#loading_screen').show();
        if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
            updateDataByKey(sessionStorage.getItem('email'),`users`,{ feedback: user_feedback });
            //updateDataByKey(sessionStorage.getItem('email'),`users`, { rate: parseInt(rate) });
        }
      $('.play_game,#game_status').show();
      $('.layeout,#loading_screen').hide()
        swal.fire({
            icon:'success',
            text:'Thank you for your valuable feedback.',
            allowOutsideClick:false,
        }).then((result)=>{
            if(result.isConfirmed){
              if(parseInt($('.setting_menu').attr('data-open_menu'))==0){
                startGame();
               }
            }
        })
      }
    })
}
function game_setting(){
    if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
        var user_icon_split=sessionStorage.getItem('name').split(/[ .]/);//nee to learn
        if(user_icon_split.length==1){
            $('#user_icon').text(user_icon_split[0].charAt(0));
        }else if(user_icon_split.length==2){
            $('#user_icon').text(user_icon_split[0].charAt(0)+user_icon_split[1].charAt(0));
        }
        $('#user_name').text(sessionStorage.getItem('name'));
        $('#user_email').text(sessionStorage.getItem('email_original'));
    
        getDataByKey(sessionStorage.getItem('email'),`game_normal`).then(userData => {
            if (userData !== null) {
                sessionStorage.setItem('score',userData['score']);
            }
        })
        getDataByKey(sessionStorage.getItem('email'),`users`).then(userData => {
            if (userData !== null) {
                if(userData['feedback']!=''){
                    $('#user_feedback_view').text(userData['feedback']);
                    $('#level_'+userData['level']).css({'background-color':'#4e7cb5','color':'white'});
                }
                if(userData['rate']!=0){
                    if(userData['rate']==1){
                        $('.emoji_icon').html('&#128522;');
                    }else if(userData['rate']=2){
                        $('.emoji_icon').html('&#128512;');
                    }else if(userData['rate']=3){
                        $('.emoji_icon').html('&#128519;');
                    }else if(userData['rate']=4){
                        $('.emoji_icon').html('&#128525;');
                    }else if(userData['rate']=5){
                        $('.emoji_icon').html('&#128536;');
                    }
                    for (let i = 1; i <= userData['rate']; i++) {
                        $('#' + i).addClass("active");
                    }
                } 
            }else{
                $('#level_1').css({'background-color':'#4e7cb5','color':'white'});
            }
        });
    }
}

$(document).on('click','.setting_menu',function(e){
    var open_status=$('.setting_menu').attr('data-open_menu');
    if(open_status==0){
        $('.pause_game').trigger('click');
        $('.layeout').css('position','relative');
        $('.menu_fields').show();
        $('.setting_menu').attr('data-open_menu',1);
    }else if(open_status==1){
        $('.menu_fields').hide();
        $('.setting_menu').attr('data-open_menu',0);
        $('.play_game').trigger('click');
        $('.layeout').css('position','absolute');
    }
})
$(document).on('click','.removeActive',function(e){
    $('.removeActive').removeClass("active");
    var rate=e.currentTarget.id;
    let shouldShowFeedback = rate > 0;
    if(rate==1){
        $('.emoji_icon').html('&#128522;');
    }else if(rate=2){
        $('.emoji_icon').html('&#128512;');
    }else if(rate=3){
        $('.emoji_icon').html('&#128519;');
    }else if(rate=4){
        $('.emoji_icon').html('&#128525;');
    }else if(rate=5){
        $('.emoji_icon').html('&#128536;');
    }
    for (let i = 1; i <= rate; i++) {
      $('#' + i).css('color','ff9c1a');
    }
//     if (shouldShowFeedback) {
//       updateDataByKey(sessionStorage.getItem('email'),`users`, { rate: parseInt(rate) });
//  getDataByKey(sessionStorage.getItem('email'),`users`).then(userData => {
//             if (userData !== null) {
//                  User_Feedback(userData['feedback']);
//             }
//         });
//     }
})
$(document).on('click','#gameArea',function(e){
    $('.pause_game').trigger('click');
})
function setthemes(level){
    $('#ball1').attr('src',changeUI[0]['level_'+level]['image1']['src']);
    $('#ball2').attr('src',changeUI[0]['level_'+level]['image2']['src']);
    $('#ball3').attr('src',changeUI[0]['level_'+level]['image3']['src']);
    // width
    $('#ball1').attr('width',changeUI[0]['level_'+level]['image1']['width']);
    $('#ball2').attr('width',changeUI[0]['level_'+level]['image2']['width']);
    $('#ball3').attr('width',changeUI[0]['level_'+level]['image3']['width']);
    // height
    $('#ball1').attr('height',changeUI[0]['level_'+level]['image1']['height']);
    $('#ball2').attr('height',changeUI[0]['level_'+level]['image2']['height']);
    $('#ball3').attr('height',changeUI[0]['level_'+level]['image3']['height']);

    //$('body').css('background-image','url('+changeUI[0]['level_'+level]['image4']+')');
    $('#gameArea').css('background-image','url('+changeUI[0]['level_'+level]['image5']+')');
    if(level==8){
        $('.ball span').css({'top':'40px','left':'19px'});
    }else{
        $('.ball span').css({'top':'35px','left':'29px'});
    }
}
$(document).on('click','#start_normal_game',function(e){
  gameLevelStatus=0;
    swal.fire({
        icon:'info',
        text:'It is a normal game with no levels. In the game, if you catch the thief three times and miss 20 foods, the game will be over.',
      showCancelButton:true,
      allowOutsideClick:false,
    }).then((result)=>{
        if (result.isConfirmed) {
            setthemes(1);
            startGame();
            $('.game_level_list').hide();
            if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
                getDataByKey(sessionStorage.getItem('email'),`game_normal`).then(userData => {
                    console.log(userData);
                    if(userData==undefined || userData==null || userData==''){
                        set(ref(database, 'game_normal/' +sessionStorage.getItem('email')), {
                            name:sessionStorage.getItem('name'),
                            score:0,
                            missed:0,
                            time:'',
                        });
                    }
                });
            }
        }
    })
})
$(document).on('click','#start_level_game',function(e){
    $('.play_game,#game_status').hide();
    $('.layeout,#loading_screen').show();
    gameLevelStatus=1;
    if(sessionStorage.getItem('name')!=null && sessionStorage.getItem('email')!=null){
        getDataByKey(sessionStorage.getItem('email'),`users`).then(userData => {
            if (userData !== null) {
                GameLevel=(userData['level'])?userData['level']:'';
                Game_Level(GameLevel);
            }
        });
        getDataByKey(sessionStorage.getItem('email'),`game_level`).then(userData => {
            if(userData==undefined || userData==null || userData==''){
                set(ref(database, 'game_level/' +sessionStorage.getItem('email')+'/level_'+GameLevel), {
                    name:sessionStorage.getItem('name'),
                    'score': 0,
                    'missed': 0,
                    'time': '',
                });
            }
        });
    }else{
        Game_Level(GameLevel);
    }
})
$(document).on('click','#start_game_exit',function(e){
    window.close();
})
$(document).on('click','#game_login',function(e){
    if(sessionStorage.getItem('name')==null && sessionStorage.getItem('email')==null){
    swal.fire({
        title:'<p style="font-size:20px">Provide your information</p>',
        html:'<label class="text-start ml-2" style="width: 97%;" for="input_user_name">Name :<input type="text" autocomplete="off" id="input_user_name" class="form-control mt-2" placeholder="Enter the name."/></label> <label class="text-start mt-2 ml-2" style="width: 97%;" for="input_user_email">Email : <input autocomplete="off" class="form-control mt-2 mb-2" type="email" placeholder="Enter the email." id="input_user_email"/></label>',
        allowOutsideClick:false,
        showCancelButton:true,
        confirmButtonText:'Submit',
        preConfirm: () => {
            const name = document.getElementById('input_user_name').value;
            const email = document.getElementById('input_user_email').value;
            if(!name) {
                Swal.showValidationMessage('Please enter a name.');
            }else if (!email) {
                Swal.showValidationMessage('Please enter a email.');
            }else if (!isValidEmail(email)) {
                Swal.showValidationMessage('Please enter a valid email address.');
            }
            return { name, email };
        }
    }).then((result) => {
        
    if (result.isConfirmed) {
        const { name, email } = result.value;
        sessionStorage.setItem('name',name);
        sessionStorage.setItem('email',encodeEmail(email));
        sessionStorage.setItem('email_original',email);
        // Inserting data one by one
        $('.play_game,#game_status').hide();
    $('.layeout,#loading_screen').show();
        getDataByKey(encodeEmail(email),`users`).then(userData => {
            if(userData==undefined || userData==null || userData==''){
                set(ref(database, 'users/' +encodeEmail(email)), {
                    name:name,
                    level: 1,
                    feedback:'',
                    rate:0,
                });
            }else{
                GameLevel=(userData['level'])?userData['level']:'';
            }
            $('#game_login').hide();
           // $('.play_game').show();
           // $('.layeout').hide()
          $('.play_game,#game_status').show();
    $('.layeout,#loading_screen').hide();
        });
    }
    });
    }else{
        //$('.play_game').hide();
        //$('.layeout').show();
      $('.play_game,#game_status').hide();
      $('.layeout,#loading_screen').show();
        getDataByKey(sessionStorage.getItem('email'),`users`).then(userData => {
            if (userData !== null) {
                GameLevel=(userData['level'])?userData['level']:'';
                $('#game_login').hide();
                //$('.play_game').show();
                //$('.layeout').hide();
               $('.play_game,#game_status').show();
               $('.layeout,#loading_screen').hide();
            }
        });
    }
})
$(document).on('click','#game_help_btn',function(e){
    $('.game_help_container').show();
    $('.start_game_button').hide();
})
$(document).on('click','#Back_home_page',function(e){
    $('.game_help_container,.game_about_container').hide();
    $('.start_game_button').show();
})
$(document).on('click','#game_about_btn',function(e){
    $('.game_about_container').show();
    $('.start_game_button').hide();
})

$(document).on('click','#Back_play_page',function(e){
    play_game_now();
})

function generateRandomNumbersWithExclusion(totalNumbers, excludedRangeStart, excludedRangeEnd) {
    var randomNumbers = [];

    while (randomNumbers.length < totalNumbers) {
        var randomNumber = Math.floor(Math.random() * 100); // Adjust the range as needed

        // Check if the generated number is outside the excluded range
        if (randomNumber < excludedRangeStart || randomNumber >= excludedRangeEnd) {
            randomNumbers.push(randomNumber);
        }
    }

    return randomNumbers;
}
