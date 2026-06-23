const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const vocabSets = [
  {
    id: "vocab-01",
    type: "vocab",
    nameEn: "Greetings & Basics",
    nameZh: "问候与基础",
    cards: [
      ["你好", "Hello"], ["再见", "Goodbye"], ["谢谢", "Thank you"], ["不客气", "You're welcome"],
      ["对不起", "Sorry"], ["没关系", "No problem"], ["请", "Please"], ["是", "Yes"],
      ["不是", "No"], ["好", "Good"], ["不好", "Not good"], ["可以", "Can / OK"],
      ["不可以", "Cannot"], ["要", "Want / need"], ["不要", "Don't want"], ["有", "Have"],
      ["没有", "Don't have"], ["在", "At / in"], ["不在", "Not here"], ["我", "I / me"],
      ["你", "You"], ["他", "He"], ["她", "She"], ["我们", "We"],
      ["你们", "You (plural)"], ["他们", "They"], ["这", "This"], ["那", "That"],
      ["什么", "What"], ["谁", "Who"], ["哪里", "Where"], ["为什么", "Why"],
      ["怎么", "How"], ["多少", "How much / many"], ["几", "How many"], ["现在", "Now"],
      ["今天", "Today"], ["明天", "Tomorrow"], ["昨天", "Yesterday"], ["早上", "Morning"],
      ["中午", "Noon"], ["晚上", "Evening"], ["名字", "Name"], ["朋友", "Friend"],
      ["家", "Home / family"], ["工作", "Work"], ["学习", "Study"], ["喜欢", "Like"],
      ["爱", "Love"], ["知道", "Know"], ["懂", "Understand"]
    ]
  },
  {
    id: "vocab-02",
    type: "vocab",
    nameEn: "Numbers & Time",
    nameZh: "数字与时间",
    cards: [
      ["零", "Zero"], ["一", "One"], ["二", "Two"], ["三", "Three"], ["四", "Four"],
      ["五", "Five"], ["六", "Six"], ["七", "Seven"], ["八", "Eight"], ["九", "Nine"],
      ["十", "Ten"], ["百", "Hundred"], ["千", "Thousand"], ["万", "Ten thousand"],
      ["第一", "First"], ["第二", "Second"], ["半", "Half"], ["点", "O'clock / point"],
      ["分钟", "Minute"], ["小时", "Hour"], ["秒", "Second"], ["星期", "Week"],
      ["星期一", "Monday"], ["星期二", "Tuesday"], ["星期三", "Wednesday"],
      ["星期四", "Thursday"], ["星期五", "Friday"], ["星期六", "Saturday"], ["星期日", "Sunday"],
      ["月", "Month"], ["年", "Year"], ["春天", "Spring"], ["夏天", "Summer"],
      ["秋天", "Autumn"], ["冬天", "Winter"], ["早", "Early"], ["晚", "Late"],
      ["快", "Fast"], ["慢", "Slow"], ["时间", "Time"], ["日期", "Date"],
      ["以前", "Before"], ["以后", "After"], ["经常", "Often"], ["有时候", "Sometimes"],
      ["总是", "Always"], ["从不", "Never"], ["已经", "Already"], ["还", "Still"],
      ["马上", "Right away"], ["一会儿", "A moment"]
    ]
  },
  {
    id: "vocab-03",
    type: "vocab",
    nameEn: "Family & People",
    nameZh: "家庭与人物",
    cards: [
      ["爸爸", "Dad"], ["妈妈", "Mom"], ["父母", "Parents"], ["儿子", "Son"], ["女儿", "Daughter"],
      ["哥哥", "Older brother"], ["弟弟", "Younger brother"], ["姐姐", "Older sister"],
      ["妹妹", "Younger sister"], ["爷爷", "Grandfather (paternal)"], ["奶奶", "Grandmother (paternal)"],
      ["外公", "Grandfather (maternal)"], ["外婆", "Grandmother (maternal)"], ["丈夫", "Husband"],
      ["妻子", "Wife"], ["孩子", "Child"], ["婴儿", "Baby"], ["男人", "Man"], ["女人", "Woman"],
      ["男孩", "Boy"], ["女孩", "Girl"], ["老师", "Teacher"], ["学生", "Student"], ["医生", "Doctor"],
      ["护士", "Nurse"], ["警察", "Police officer"], ["司机", "Driver"], ["工人", "Worker"],
      ["农民", "Farmer"], ["老板", "Boss"], ["同事", "Colleague"], ["邻居", "Neighbor"],
      ["陌生人", "Stranger"], ["客人", "Guest"], ["主人", "Host"], ["年轻人", "Young person"],
      ["老人", "Elderly person"], ["成人", "Adult"], ["单身", "Single"], ["结婚", "Married"],
      ["离婚", "Divorced"], ["亲戚", "Relative"], ["家人", "Family members"], ["人口", "Population"],
      ["民族", "Ethnicity"], ["国籍", "Nationality"], ["年龄", "Age"], ["性格", "Personality"],
      ["脾气", "Temper"], ["外貌", "Appearance"], ["身高", "Height"], ["体重", "Weight"]
    ]
  },
  {
    id: "vocab-04",
    type: "vocab",
    nameEn: "Food & Drink",
    nameZh: "食物与饮料",
    cards: [
      ["米饭", "Rice"], ["面条", "Noodles"], ["面包", "Bread"], ["饺子", "Dumplings"],
      ["包子", "Steamed buns"], ["粥", "Congee"], ["汤", "Soup"], ["肉", "Meat"],
      ["牛肉", "Beef"], ["猪肉", "Pork"], ["鸡肉", "Chicken"], ["鱼", "Fish"],
      ["虾", "Shrimp"], ["蛋", "Egg"], ["豆腐", "Tofu"], ["蔬菜", "Vegetables"],
      ["水果", "Fruit"], ["苹果", "Apple"], ["香蕉", "Banana"], ["橙子", "Orange"],
      ["西瓜", "Watermelon"], ["葡萄", "Grapes"], ["草莓", "Strawberry"], ["茶", "Tea"],
      ["咖啡", "Coffee"], ["牛奶", "Milk"], ["果汁", "Juice"], ["啤酒", "Beer"],
      ["水", "Water"], ["糖", "Sugar"], ["盐", "Salt"], ["油", "Oil"], ["酱油", "Soy sauce"],
      ["辣", "Spicy"], ["甜", "Sweet"], ["酸", "Sour"], ["苦", "Bitter"], ["咸", "Salty"],
      ["好吃", "Delicious"], ["饿", "Hungry"], ["渴", "Thirsty"], ["饱", "Full"],
      ["早餐", "Breakfast"], ["午餐", "Lunch"], ["晚餐", "Dinner"], ["小吃", "Snack"],
      ["快餐", "Fast food"], ["外卖", "Takeout"], ["菜谱", "Recipe"], ["筷子", "Chopsticks"]
    ]
  },
  {
    id: "vocab-05",
    type: "vocab",
    nameEn: "Colors & Adjectives",
    nameZh: "颜色与形容词",
    cards: [
      ["红色", "Red"], ["蓝色", "Blue"], ["绿色", "Green"], ["黄色", "Yellow"],
      ["白色", "White"], ["黑色", "Black"], ["灰色", "Gray"], ["粉色", "Pink"],
      ["紫色", "Purple"], ["橙色", "Orange"], ["棕色", "Brown"], ["金色", "Gold"],
      ["银色", "Silver"], ["大", "Big"], ["小", "Small"], ["长", "Long"], ["短", "Short"],
      ["高", "Tall / high"], ["矮", "Short (height)"], ["胖", "Fat"], ["瘦", "Thin"],
      ["新", "New"], ["旧", "Old"], ["年轻", "Young"], ["老", "Old"], ["漂亮", "Beautiful"],
      ["帅", "Handsome"], ["丑", "Ugly"], ["干净", "Clean"], ["脏", "Dirty"],
      ["热", "Hot"], ["冷", "Cold"], ["暖", "Warm"], ["凉", "Cool"], ["忙", "Busy"],
      ["闲", "Free / idle"], ["累", "Tired"], ["容易", "Easy"], ["难", "Difficult"],
      ["重要", "Important"], ["有趣", "Interesting"], ["无聊", "Boring"], ["高兴", "Happy"],
      ["难过", "Sad"], ["生气", "Angry"], ["害怕", "Afraid"], ["紧张", "Nervous"],
      ["安静", "Quiet"], ["吵", "Noisy"], ["安全", "Safe"], ["危险", "Dangerous"]
    ]
  },
  {
    id: "vocab-06",
    type: "vocab",
    nameEn: "Body & Health",
    nameZh: "身体与健康",
    cards: [
      ["头", "Head"], ["脸", "Face"], ["眼睛", "Eyes"], ["耳朵", "Ears"], ["鼻子", "Nose"],
      ["嘴", "Mouth"], ["牙齿", "Teeth"], ["头发", "Hair"], ["脖子", "Neck"], ["肩膀", "Shoulders"],
      ["手臂", "Arms"], ["手", "Hand"], ["手指", "Fingers"], ["腿", "Legs"], ["脚", "Feet"],
      ["心", "Heart"], ["胃", "Stomach"], ["背", "Back"], ["皮肤", "Skin"], ["骨头", "Bones"],
      ["健康", "Health"], ["生病", "Sick"], ["感冒", "Cold (illness)"], ["发烧", "Fever"],
      ["咳嗽", "Cough"], ["头痛", "Headache"], ["肚子痛", "Stomachache"], ["药", "Medicine"],
      ["医院", "Hospital"], ["诊所", "Clinic"], ["检查", "Examination"], ["手术", "Surgery"],
      ["休息", "Rest"], ["睡觉", "Sleep"], ["运动", "Exercise"], ["跑步", "Running"],
      ["游泳", "Swimming"], ["瑜伽", "Yoga"], ["减肥", "Lose weight"], ["营养", "Nutrition"],
      ["维生素", "Vitamins"], ["过敏", "Allergy"], ["受伤", "Injured"], ["流血", "Bleeding"],
      ["绷带", "Bandage"], ["疫苗", "Vaccine"], ["体检", "Physical exam"], ["康复", "Recovery"],
      ["疼痛", "Pain"], ["舒服", "Comfortable"], ["不舒服", "Uncomfortable"], ["精神", "Spirit / mental"]
    ]
  },
  {
    id: "vocab-07",
    type: "vocab",
    nameEn: "School & Work",
    nameZh: "学校与工作",
    cards: [
      ["学校", "School"], ["大学", "University"], ["中学", "Middle school"], ["小学", "Elementary school"],
      ["教室", "Classroom"], ["图书馆", "Library"], ["实验室", "Laboratory"], ["作业", "Homework"],
      ["考试", "Exam"], ["成绩", "Grade / score"], ["课本", "Textbook"], ["笔记", "Notes"],
      ["铅笔", "Pencil"], ["钢笔", "Pen"], ["橡皮", "Eraser"], ["书包", "Schoolbag"],
      ["课", "Class / lesson"], ["数学", "Math"], ["科学", "Science"], ["历史", "History"],
      ["地理", "Geography"], ["音乐", "Music"], ["体育", "PE"], ["艺术", "Art"],
      ["公司", "Company"], ["办公室", "Office"], ["会议", "Meeting"], ["项目", "Project"],
      ["任务", "Task"], ["报告", "Report"], ["邮件", "Email"], ["电话", "Phone call"],
      ["工资", "Salary"], ["假期", "Holiday / vacation"], ["加班", "Overtime"], ["辞职", "Resign"],
      ["招聘", "Recruitment"], ["面试", "Interview"], ["简历", "Resume"], ["经验", "Experience"],
      ["技能", "Skill"], ["培训", "Training"], ["同事", "Colleague"], ["上司", "Supervisor"],
      ["下属", "Subordinate"], ["客户", "Client"], ["合同", "Contract"], ["利润", "Profit"],
      ["市场", "Market"], ["销售", "Sales"], ["管理", "Management"], ["创业", "Start a business"]
    ]
  },
  {
    id: "vocab-08",
    type: "vocab",
    nameEn: "Travel & Places",
    nameZh: "旅行与地点",
    cards: [
      ["旅行", "Travel"], ["旅游", "Tourism"], ["机场", "Airport"], ["火车站", "Train station"],
      ["地铁站", "Subway station"], ["公共汽车", "Bus"], ["出租车", "Taxi"], ["票", "Ticket"],
      ["护照", "Passport"], ["签证", "Visa"], ["行李", "Luggage"], ["酒店", "Hotel"],
      ["房间", "Room"], ["地图", "Map"], ["方向", "Direction"], ["东", "East"], ["西", "West"],
      ["南", "South"], ["北", "North"], ["左边", "Left side"], ["右边", "Right side"],
      ["前面", "Front"], ["后面", "Back"], ["附近", "Nearby"], ["远处", "Far away"],
      ["城市", "City"], ["乡村", "Countryside"], ["山", "Mountain"], ["河", "River"],
      ["海", "Sea"], ["湖", "Lake"], ["公园", "Park"], ["博物馆", "Museum"],
      ["商店", "Shop"], ["超市", "Supermarket"], ["银行", "Bank"], ["邮局", "Post office"],
      ["图书馆", "Library"], ["电影院", "Cinema"], ["餐厅", "Restaurant"], ["厕所", "Restroom"],
      ["路", "Road"], ["街", "Street"], ["桥", "Bridge"], ["楼", "Building / floor"],
      ["入口", "Entrance"], ["出口", "Exit"], ["停车", "Parking"], ["风景", "Scenery"],
      ["照片", "Photo"], ["纪念品", "Souvenir"], ["导游", "Tour guide"], ["迷路", "Lost"]
    ]
  },
  {
    id: "vocab-09",
    type: "vocab",
    nameEn: "Animals & Nature",
    nameZh: "动物与自然",
    cards: [
      ["动物", "Animal"], ["狗", "Dog"], ["猫", "Cat"], ["鸟", "Bird"], ["鱼", "Fish"],
      ["马", "Horse"], ["牛", "Cow"], ["羊", "Sheep"], ["猪", "Pig"], ["鸡", "Chicken"],
      ["鸭", "Duck"], ["兔子", "Rabbit"], ["老鼠", "Mouse"], ["老虎", "Tiger"], ["狮子", "Lion"],
      ["大象", "Elephant"], ["熊", "Bear"], ["猴子", "Monkey"], ["蛇", "Snake"], ["青蛙", "Frog"],
      ["蝴蝶", "Butterfly"], ["蜜蜂", "Bee"], ["蚂蚁", "Ant"], ["蜘蛛", "Spider"], ["鲸鱼", "Whale"],
      ["海豚", "Dolphin"], ["熊猫", "Panda"], ["树", "Tree"], ["花", "Flower"], ["草", "Grass"],
      ["叶子", "Leaf"], ["森林", "Forest"], ["沙漠", "Desert"], ["岛", "Island"], ["天空", "Sky"],
      ["云", "Cloud"], ["太阳", "Sun"], ["月亮", "Moon"], ["星星", "Star"], ["雨", "Rain"],
      ["雪", "Snow"], ["风", "Wind"], ["雷", "Thunder"], ["闪电", "Lightning"], ["彩虹", "Rainbow"],
      ["自然", "Nature"], ["环境", "Environment"], ["污染", "Pollution"], ["保护", "Protect"],
      ["地球", "Earth"], ["海洋", "Ocean"], ["气候", "Climate"], ["温度", "Temperature"]
    ]
  },
  {
    id: "vocab-10",
    type: "vocab",
    nameEn: "Technology & Daily Life",
    nameZh: "科技与日常生活",
    cards: [
      ["电脑", "Computer"], ["手机", "Cell phone"], ["平板", "Tablet"], ["电视", "TV"],
      ["相机", "Camera"], ["耳机", "Headphones"], ["充电器", "Charger"], ["电池", "Battery"],
      ["网络", "Internet"], ["网站", "Website"], ["软件", "Software"], ["应用", "App"],
      ["密码", "Password"], ["账号", "Account"], ["下载", "Download"], ["上传", "Upload"],
      ["搜索", "Search"], ["点击", "Click"], ["屏幕", "Screen"], ["键盘", "Keyboard"],
      ["鼠标", "Mouse"], ["打印", "Print"], ["扫描", "Scan"], ["文件", "File"], ["文件夹", "Folder"],
      ["衣服", "Clothes"], ["裤子", "Pants"], ["鞋子", "Shoes"], ["帽子", "Hat"], ["包", "Bag"],
      ["手表", "Watch"], ["眼镜", "Glasses"], ["伞", "Umbrella"], ["钥匙", "Key"], ["钱包", "Wallet"],
      ["钱", "Money"], ["信用卡", "Credit card"], ["现金", "Cash"], ["价格", "Price"], ["便宜", "Cheap"],
      ["贵", "Expensive"], ["打折", "Discount"], ["购物", "Shopping"], ["快递", "Delivery"],
      ["洗衣", "Laundry"], ["打扫", "Clean (verb)"], ["做饭", "Cook"], ["洗澡", "Take a bath"],
      ["起床", "Get up"], ["睡觉", "Go to sleep"]
    ]
  }
];

const phraseSets = [
  {
    id: "phrases-01",
    type: "phrases",
    nameEn: "Daily Greetings",
    nameZh: "日常问候",
    cards: [
      ["你好吗？", "How are you?"], ["我很好，谢谢。", "I'm fine, thank you."],
      ["早上好！", "Good morning!"], ["晚上好！", "Good evening!"], ["好久不见！", "Long time no see!"],
      ["最近怎么样？", "How have you been lately?"], ["还不错。", "Not bad."], ["很高兴见到你。", "Nice to meet you."],
      ["我也是。", "Me too."], ["祝你有美好的一天！", "Have a nice day!"], ["晚安。", "Good night."],
      ["你吃了吗？", "Have you eaten? (greeting)"], ["我刚吃过。", "I just ate."], ["欢迎！", "Welcome!"],
      ["一路平安。", "Have a safe trip."], ["保重。", "Take care."], ["回头见。", "See you later."],
      ["明天见。", "See you tomorrow."], ["周末愉快！", "Have a nice weekend!"], ["节日快乐！", "Happy holiday!"],
      ["生日快乐！", "Happy birthday!"], ["恭喜！", "Congratulations!"], ["新年快乐！", "Happy New Year!"],
      ["你忙吗？", "Are you busy?"], ["我不忙。", "I'm not busy."], ["你在做什么？", "What are you doing?"],
      ["我在学习中文。", "I'm studying Chinese."], ["今天天气真好。", "The weather is great today."],
      ["是啊。", "Yeah."], ["真的吗？", "Really?"], ["当然。", "Of course."], ["也许吧。", "Maybe."],
      ["我不知道。", "I don't know."], ["我明白了。", "I understand."], ["请再说一遍。", "Please say it again."],
      ["请说慢一点。", "Please speak slower."], ["你会说英语吗？", "Do you speak English?"],
      ["我会一点中文。", "I speak a little Chinese."], ["请多关照。", "Please look after me."],
      ["彼此彼此。", "Same to you."], ["有空一起吃饭吧。", "Let's eat together when you're free."],
      ["好的，没问题。", "OK, no problem."], ["到时候联系。", "Contact me when the time comes."],
      ["我先走了。", "I'm leaving first."], ["慢走。", "Take care (to someone leaving)."],
      ["欢迎再来。", "Welcome back again."], ["祝你好运！", "Good luck!"], ["加油！", "Keep it up! / You got this!"],
      ["辛苦了。", "Thanks for your hard work."], ["别客气。", "Don't mention it."]
    ]
  },
  {
    id: "phrases-02",
    type: "phrases",
    nameEn: "Shopping",
    nameZh: "购物",
    cards: [
      ["这个多少钱？", "How much is this?"], ["太贵了。", "It's too expensive."], ["便宜一点吧。", "Can you make it cheaper?"],
      ["我要买这个。", "I want to buy this."], ["有别的颜色吗？", "Do you have other colors?"],
      ["有大一点的吗？", "Do you have a bigger size?"], ["有小一点的吗？", "Do you have a smaller size?"],
      ["可以试穿吗？", "Can I try it on?"], ["试衣间在哪里？", "Where is the fitting room?"],
      ["我只需要看看。", "I'm just looking."], ["请给我一个袋子。", "Please give me a bag."],
      ["可以刷卡吗？", "Can I pay by card?"], ["可以扫码支付吗？", "Can I pay by scanning QR code?"],
      ["有收据吗？", "Do you have a receipt?"], ["可以退货吗？", "Can I return this?"],
      ["有保修吗？", "Is there a warranty?"], ["打几折？", "What's the discount?"],
      ["买一送一吗？", "Is it buy one get one free?"], ["我要两个。", "I want two."],
      ["一共多少钱？", "How much in total?"], ["找零请给我。", "Please give me the change."],
      ["不用找了。", "Keep the change."], ["有现货吗？", "Is it in stock?"],
      ["什么时候到货？", "When will it arrive?"], ["请帮我包起来。", "Please wrap it for me."],
      ["这是礼物。", "This is a gift."], ["有没有新款？", "Do you have new models?"],
      ["和照片上一样吗？", "Is it the same as in the photo?"], ["质量怎么样？", "How is the quality?"],
      ["我对比一下。", "Let me compare."], ["我再考虑一下。", "I'll think about it."],
      ["今天有活动吗？", "Are there any promotions today?"], ["会员有优惠吗？", "Is there a member discount?"],
      ["请推荐一下。", "Please recommend something."], ["哪个更受欢迎？", "Which is more popular?"],
      ["我要退款。", "I want a refund."], ["这个东西坏了。", "This item is broken."],
      ["能换一个新的吗？", "Can I exchange for a new one?"], ["发票抬头是什么？", "What is the invoice title?"],
      ["请开发票。", "Please issue an invoice."], ["超市在哪里？", "Where is the supermarket?"],
      ["药店在几楼？", "Which floor is the pharmacy on?"], ["营业到几点？", "What time do you close?"],
      ["现在开门吗？", "Are you open now?"], ["购物车在哪里？", "Where are the shopping carts?"],
      ["自助结账在哪里？", "Where is self-checkout?"], ["请帮我称一下。", "Please weigh this for me."],
      ["这是进口的吗？", "Is this imported?"], ["保质期到什么时候？", "What's the expiration date?"],
      ["我找到了。", "I found it."], ["谢谢，够了。", "Thanks, that's enough."]
    ]
  },
  {
    id: "phrases-03",
    type: "phrases",
    nameEn: "Restaurant",
    nameZh: "餐厅",
    cards: [
      ["几位？", "How many people?"], ["两位。", "Two people."], ["请给我菜单。", "Please give me the menu."],
      ["有什么推荐？", "What do you recommend?"], ["我要这个。", "I'll have this."], ["不要辣。", "No spicy, please."],
      ["微辣就好。", "Mild spice is fine."], ["我对海鲜过敏。", "I'm allergic to seafood."],
      ["我是素食者。", "I'm vegetarian."], ["请少放盐。", "Please use less salt."],
      ["可以打包吗？", "Can I get this to go?"], ["请给我筷子。", "Please give me chopsticks."],
      ["请给我一杯水。", "Please give me a glass of water."], ["要冰的吗？", "Do you want ice?"],
      ["请来一壶茶。", "Please bring a pot of tea."], ["买单。", "Check, please."],
      ["分开付。", "Split the bill."], ["一起付。", "Pay together."], ["味道很好。", "It tastes great."],
      ["太多了，吃不完。", "It's too much, I can't finish."], ["请再上一份。", "Please bring another serving."],
      ["等多久？", "How long is the wait?"], ["有座位吗？", "Do you have seats available?"],
      ["需要预约吗？", "Do I need a reservation?"], ["我预约了。", "I have a reservation."],
      ["请靠窗的位置。", "A window seat, please."], ["这里可以吸烟吗？", "Can I smoke here?"],
      ["洗手间在哪里？", "Where is the restroom?"], ["请给我纸巾。", "Please give me napkins."],
      ["太咸了。", "It's too salty."], ["不够熟。", "It's not cooked enough."],
      ["请加热一下。", "Please heat it up."], ["有儿童椅吗？", "Do you have a high chair?"],
      ["这是本店特色。", "This is our specialty."], ["今日特价是什么？", "What's today's special?"],
      ["可以换一道菜吗？", "Can I change this dish?"], ["我对花生过敏。", "I'm allergic to peanuts."],
      ["请快一点，我赶时间。", "Please hurry, I'm in a rush."], ["慢慢来，不着急。", "Take your time, no rush."],
      ["我能看看厨房吗？", "Can I see the kitchen?"], ["这道菜怎么做？", "How is this dish prepared?"],
      ["请给我牙签。", "Please give me a toothpick."], ["有小费吗？", "Is tipping expected?"],
      ["服务很好。", "The service is great."], ["我吃饱了。", "I'm full."], ["下次再来。", "I'll come again."]
    ]
  },
  {
    id: "phrases-04",
    type: "phrases",
    nameEn: "Directions",
    nameZh: "问路",
    cards: [
      ["请问，怎么去火车站？", "Excuse me, how do I get to the train station?"],
      ["直走然后左转。", "Go straight and turn left."], ["直走然后右转。", "Go straight and turn right."],
      ["在第二个路口右转。", "Turn right at the second intersection."], ["过马路。", "Cross the street."],
      ["在红绿灯那里左转。", "Turn left at the traffic light."], ["就在前面。", "It's just ahead."],
      ["离这里远吗？", "Is it far from here?"], ["不远，走路十分钟。", "Not far, ten minutes on foot."],
      ["很远，最好打车。", "It's far, better take a taxi."], ["地图上的这个地方在哪里？", "Where is this place on the map?"],
      ["我迷路了。", "I'm lost."], ["你能带我去吗？", "Can you take me there?"],
      ["这是哪条路？", "What road is this?"], ["下一个站是什么？", "What's the next stop?"],
      ["请在下一站下车。", "Please get off at the next stop."], ["怎么换乘？", "How do I transfer?"],
      ["地铁几号线？", "Which subway line?"], ["往哪个方向走？", "Which direction should I go?"],
      ["在对面。", "It's across the street."], ["在拐角处。", "It's at the corner."],
      ["在二楼。", "It's on the second floor."], ["在地下室。", "It's in the basement."],
      ["入口在哪里？", "Where is the entrance?"], ["出口在哪里？", "Where is the exit?"],
      ["停车场在哪里？", "Where is the parking lot?"], ["附近有公交站吗？", "Is there a bus stop nearby?"],
      ["首班车几点？", "What time is the first train?"], ["末班车几点？", "What time is the last train?"],
      ["堵车了。", "There's a traffic jam."], ["请开快一点。", "Please drive faster."],
      ["请在这里停车。", "Please stop here."], ["到了叫我。", "Let me know when we arrive."],
      ["大概要多长时间？", "About how long will it take?"], ["走这条路对吗？", "Is this the right way?"],
      ["错了，应该往回走。", "Wrong way, you should go back."], ["沿着河走。", "Walk along the river."],
      ["地标是什么？", "What's the landmark?"], ["看到大桥就到了。", "You'll see it when you see the big bridge."],
      ["在银行旁边。", "Next to the bank."], ["在超市后面。", "Behind the supermarket."],
      ["在学校和公园之间。", "Between the school and the park."], ["往北走两百米。", "Go north for 200 meters."],
      ["电梯在哪里？", "Where is the elevator?"], ["楼梯在哪里？", "Where are the stairs?"],
      ["请问您能画个地图吗？", "Could you draw a map for me?"], ["我看看导航。", "Let me check the navigation."],
      ["信号不好。", "The signal is bad."], ["我们到了。", "We've arrived."], ["谢谢您的帮助。", "Thank you for your help."]
    ]
  },
  {
    id: "phrases-05",
    type: "phrases",
    nameEn: "Phone & Internet",
    nameZh: "电话与网络",
    cards: [
      ["喂，你好。", "Hello? (on phone)"], ["请问是张先生吗？", "May I speak to Mr. Zhang?"],
      ["请稍等。", "Please hold on."], ["他不在。", "He's not here."], ["可以留言吗？", "Can I leave a message?"],
      ["请转告他回电话。", "Please tell him to call back."], ["打错了。", "Wrong number."],
      ["信号不好，听不清。", "Bad signal, I can't hear clearly."], ["我发短信给你。", "I'll text you."],
      ["你的微信号是多少？", "What's your WeChat ID?"], ["我加你好友。", "I'll add you as a friend."],
      ["我通过了你的好友请求。", "I accepted your friend request."], ["在吗？", "Are you there?"],
      ["收到。", "Received."], ["好的。", "OK."], ["没问题。", "No problem."],
      ["wifi密码是多少？", "What's the WiFi password?"], ["连不上网。", "Can't connect to the internet."],
      ["网速太慢了。", "The internet is too slow."], ["请重启路由器。", "Please restart the router."],
      ["我电脑死机了。", "My computer froze."], ["请更新软件。", "Please update the software."],
      ["文件打不开了。", "The file won't open."], ["请把链接发给我。", "Please send me the link."],
      ["我转发给你。", "I'll forward it to you."], ["请查收邮件。", "Please check your email."],
      ["附件太大了。", "The attachment is too big."], ["视频会议几点开始？", "What time does the video meeting start?"],
      ["请开摄像头。", "Please turn on your camera."], ["请静音。", "Please mute yourself."],
      ["你能听到我说话吗？", "Can you hear me?"], ["我屏幕共享一下。", "I'll share my screen."],
      ["账号被盗了。", "My account was hacked."], ["请改密码。", "Please change your password."],
      ["验证码发你了。", "I sent you the verification code."], ["手机没电了。", "My phone is out of battery."],
      ["请给我充电宝。", "Please lend me a power bank."], ["我换手机号了。", "I changed my phone number."],
      ["请保存我的新号码。", "Please save my new number."], ["语音留言已发送。", "Voice message sent."],
      ["请勿打扰。", "Do not disturb."], ["飞行模式。", "Airplane mode."], ["数据漫游怎么开？", "How do I turn on data roaming?"],
      ["订阅到期了。", "The subscription expired."], ["请取消自动续费。", "Please cancel auto-renewal."],
      ["下载失败了。", "Download failed."], ["正在上传，请稍等。", "Uploading, please wait."],
      ["网断了。", "The connection dropped."], ["我上线一下。", "I'll come online for a bit."]
    ]
  },
  {
    id: "phrases-06",
    type: "phrases",
    nameEn: "Weather & Small Talk",
    nameZh: "天气与闲聊",
    cards: [
      ["今天天气怎么样？", "How's the weather today?"], ["今天很热。", "It's very hot today."],
      ["今天很冷。", "It's very cold today."], ["下雨了。", "It's raining."], ["下雪了。", "It's snowing."],
      ["刮风了。", "It's windy."], ["出太阳了。", "The sun is out."], ["阴天。", "It's cloudy."],
      ["记得带伞。", "Remember to bring an umbrella."], ["多穿点衣服。", "Wear more clothes."],
      ["气温多少度？", "What's the temperature?"], ["湿度很大。", "The humidity is high."],
      ["有雾霾。", "There's smog."], ["空气质量不好。", "Air quality is poor."], ["春天来了。", "Spring is here."],
      ["夏天太热了。", "Summer is too hot."], ["秋高气爽。", "Clear autumn weather."], ["冬天要到了。", "Winter is coming."],
      ["你老家天气怎样？", "How's the weather in your hometown?"], ["这边四季分明。", "The seasons are distinct here."],
      ["最近忙什么呢？", "What have you been busy with lately?"], ["工作还顺利吗？", "Is work going well?"],
      ["家人都好吗？", "Is your family doing well?"], ["孩子多大了？", "How old is your child?"],
      ["你喜欢什么运动？", "What sports do you like?"], ["周末有什么计划？", "Any plans for the weekend?"],
      ["我喜欢看电影。", "I like watching movies."], ["你喜欢吃什么？", "What food do you like?"],
      ["我最近在学做饭。", "I've been learning to cook lately."], ["你有什么爱好？", "What are your hobbies?"],
      ["我喜欢旅行。", "I like traveling."], ["你去过中国吗？", "Have you been to China?"],
      ["中国很大。", "China is very big."], ["你住在哪个城市？", "Which city do you live in?"],
      ["我住在北京。", "I live in Beijing."], ["上海很现代。", "Shanghai is very modern."],
      ["这里人很热情。", "People here are very friendly."], ["你觉得怎么样？", "What do you think?"],
      ["我觉得不错。", "I think it's pretty good."], ["有道理。", "That makes sense."], ["开玩笑的。", "Just kidding."],
      ["真的假的？", "Really or not?"], ["太有趣了。", "That's so interesting."], ["我也这么想。", "I think so too."],
      ["改天聊。", "Let's chat another day."], ["保持联系。", "Stay in touch."], ["很高兴和你聊天。", "Nice chatting with you."],
      ["时间过得真快。", "Time flies."], ["今天聊得很开心。", "I had a great chat today."]
    ]
  },
  {
    id: "phrases-07",
    type: "phrases",
    nameEn: "Health & Doctor",
    nameZh: "健康与就医",
    cards: [
      ["我不舒服。", "I don't feel well."], ["我头疼。", "I have a headache."], ["我发烧了。", "I have a fever."],
      ["我咳嗽。", "I have a cough."], ["我嗓子疼。", "I have a sore throat."], ["我肚子疼。", "I have a stomachache."],
      ["我感冒了。", "I have a cold."], ["我需要看医生。", "I need to see a doctor."],
      ["请帮我挂号。", "Please help me register."], ["内科在哪里？", "Where is internal medicine?"],
      ["我过敏。", "I have allergies."], ["我对青霉素过敏。", "I'm allergic to penicillin."],
      ["请量一下体温。", "Please take my temperature."], ["血压高吗？", "Is my blood pressure high?"],
      ["需要打针吗？", "Do I need an injection?"], ["这药怎么吃？", "How do I take this medicine?"],
      ["一天三次，饭后服用。", "Three times a day after meals."], ["有什么副作用吗？", "Are there side effects?"],
      ["要多喝水。", "Drink more water."], ["要多休息。", "Get more rest."], ["请躺下来。", "Please lie down."],
      ["哪里疼？", "Where does it hurt?"], ["疼得厉害吗？", "Does it hurt a lot?"], ["从小就有的。", "I've had it since childhood."],
      ["最近才开始的。", "It just started recently."], ["需要做手术吗？", "Do I need surgery?"],
      ["住院要多久？", "How long is the hospital stay?"], ["医保可以用吗？", "Can I use health insurance?"],
      ["请开病假条。", "Please give me a sick leave note."], ["我扭到脚了。", "I sprained my ankle."],
      ["我摔了一跤。", "I fell down."], ["伤口要包扎吗？", "Does the wound need bandaging?"],
      ["请帮我换药。", "Please change my dressing."], ["复查什么时候？", "When is the follow-up?"],
      ["检查结果出来了吗？", "Are the test results ready?"], ["情况严重吗？", "Is it serious?"],
      ["不要太担心。", "Don't worry too much."], ["会好起来的。", "You'll get better."],
      ["请戒烟戒酒。", "Please quit smoking and drinking."], ["要控制饮食。", "You need to control your diet."],
      ["多运动。", "Exercise more."], ["睡眠质量不好。", "My sleep quality is poor."],
      ["我失眠了。", "I have insomnia."], ["压力很大。", "I'm under a lot of stress."],
      ["需要心理咨询吗？", "Do I need counseling?"], ["牙科在哪里？", "Where is dentistry?"],
      ["我牙疼。", "I have a toothache."], ["请洗牙。", "Please clean my teeth."], ["视力检查。", "Eye exam."],
      ["我看不清楚。", "I can't see clearly."], ["请配一副眼镜。", "Please prescribe glasses."]
    ]
  },
  {
    id: "phrases-08",
    type: "phrases",
    nameEn: "Work & Office",
    nameZh: "工作与办公室",
    cards: [
      ["早上好，同事们。", "Good morning, colleagues."], ["今天有什么安排？", "What's on the schedule today?"],
      ["九点开会。", "Meeting at nine."], ["请准时参加。", "Please attend on time."], ["会议取消了。", "The meeting is canceled."],
      ["请发我会议纪要。", "Please send me the meeting minutes."], ["我来汇报进度。", "I'll report on progress."],
      ["项目进展顺利。", "The project is going well."], ["我们遇到问题了。", "We've run into a problem."],
      ["需要更多资源。", "We need more resources."], ["截止日期是周五。", "The deadline is Friday."],
      ["能延期吗？", "Can we extend the deadline?"], ["我加班。", "I'm working overtime."], ["我先下班了。", "I'm leaving work now."],
      ["请审批这份文件。", "Please approve this document."], ["请签字。", "Please sign."], ["复印一下。", "Make a copy."],
      ["打印机没纸了。", "The printer is out of paper."], ["电脑坏了。", "The computer is broken."],
      ["请联系IT部门。", "Please contact IT."], ["新客户来了。", "A new client is here."],
      ["请接待一下。", "Please receive them."], ["合同谈好了。", "The contract is settled."], ["报价发你了。", "I sent you the quote."],
      ["预算不够。", "The budget isn't enough."], ["需要降低成本。", "We need to cut costs."],
      ["销售额上升了。", "Sales went up."], ["业绩不错。", "Good performance."], ["年终奖金多少？", "How much is the year-end bonus?"],
      ["我请病假。", "I'm taking sick leave."], ["我请年假。", "I'm taking annual leave."], ["谁代班？", "Who's covering?"],
      ["出差去上海。", "Business trip to Shanghai."], ["报销单在这里。", "Here's the expense report."],
      ["请填申请表。", "Please fill out the application form."], ["入职第一天。", "First day on the job."],
      ["欢迎加入团队。", "Welcome to the team."], ["请介绍一下自己。", "Please introduce yourself."],
      ["我的职责是……", "My responsibilities are..."], ["请多指教。", "Please guide me."],
      ["这个任务交给你。", "This task is assigned to you."], ["有问题随时问我。", "Ask me anytime if you have questions."],
      ["合作愉快。", "Pleasant cooperation."], ["辛苦了，大家。", "Good work, everyone."],
      ["下班前交给我。", "Give it to me before leaving."], ["邮件请抄送全体。", "Please CC everyone on the email."],
      ["我请假一天。", "I'm taking a day off."], ["办公室在十五楼。", "The office is on the 15th floor."]
    ]
  },
  {
    id: "phrases-09",
    type: "phrases",
    nameEn: "Social & Friends",
    nameZh: "社交与朋友",
    cards: [
      ["周末一起出去玩吧。", "Let's hang out this weekend."], ["去看电影怎么样？", "How about watching a movie?"],
      ["好啊，几点？", "Sure, what time?"], ["我来接你。", "I'll pick you up."], ["在哪里见面？", "Where shall we meet?"],
      ["老地方见。", "Meet at the usual place."], ["我迟到了，抱歉。", "I'm late, sorry."], ["没关系，我也刚到。", "No worries, I just arrived too."],
      ["好久没见你了。", "Haven't seen you in ages."], ["你变了不少。", "You've changed a lot."], ["还是那么年轻。", "Still look so young."],
      ["最近交男朋友了吗？", "Are you dating anyone lately?"], ["我单身。", "I'm single."], ["我们结婚了。", "We got married."],
      ["恭喜你们！", "Congratulations to you both!"], ["什么时候办婚礼？", "When is the wedding?"], ["送什么礼物好？", "What gift should I give?"],
      ["来我家做客吧。", "Come visit my home."], ["欢迎光临寒舍。", "Welcome to my humble home."],
      ["随便坐。", "Make yourself at home."], ["要喝点什么？", "What would you like to drink?"], ["别客气。", "Don't be shy."],
      ["这道菜是我做的。", "I made this dish."], ["尝尝看。", "Try it."], ["味道如何？", "How does it taste?"],
      ["太好吃了！", "It's delicious!"], ["干杯！", "Cheers!"], ["今天高兴，多喝几杯。", "Happy today, let's drink more."],
      ["少喝点酒。", "Drink less alcohol."], ["早点回去休息。", "Go home early and rest."], ["我送你。", "I'll walk you home."],
      ["路上小心。", "Be careful on the way."], ["到家告诉我。", "Tell me when you get home."], ["我到了。", "I'm home."],
      ["今天玩得很开心。", "Had a great time today."], ["下次再约。", "Let's plan again next time."], ["保持联系啊。", "Keep in touch."],
      ["加个微信吧。", "Let's add each other on WeChat."], ["我发朋友圈了。", "I posted on Moments."], ["帮我点个赞。", "Please like my post."],
      ["这张照片真好。", "This photo is great."], ["一起拍张照吧。", "Let's take a photo together."],
      ["笑一个。", "Smile."], ["你唱歌真好听。", "You sing really well."], ["我们去KTV吧。", "Let's go to karaoke."],
      ["谁请客？", "Who's treating?"], ["我请客。", "My treat."], ["AA制吧。", "Let's split the bill."],
      ["谢谢你今天的陪伴。", "Thanks for your company today."], ["友谊长存。", "Long live our friendship."]
    ]
  },
  {
    id: "phrases-10",
    type: "phrases",
    nameEn: "Emergency & Help",
    nameZh: "紧急与求助",
    cards: [
      ["救命！", "Help!"], ["请帮帮我！", "Please help me!"], ["叫警察！", "Call the police!"],
      ["叫救护车！", "Call an ambulance!"], ["着火了！", "Fire!"], ["有人受伤了。", "Someone is injured."],
      ["我丢了钱包。", "I lost my wallet."], ["护照丢了。", "I lost my passport."], ["手机被偷了。", "My phone was stolen."],
      ["请报警。", "Please call the police."], ["警察局在哪里？", "Where is the police station?"],
      ["我遇到麻烦了。", "I'm in trouble."], ["请说慢一点，我不懂。", "Please speak slower, I don't understand."],
      ["有会说英语的人吗？", "Is there someone who speaks English?"], ["请翻译一下。", "Please translate."],
      ["这是紧急情况。", "This is an emergency."], ["我迷路了，请帮帮我。", "I'm lost, please help me."],
      ["我的朋友不见了。", "My friend is missing."], ["孩子走丢了。", "The child is lost."],
      ["请广播找人。", "Please make an announcement to find someone."], ["我晕倒了。", "I fainted."],
      ["呼吸困难。", "Difficulty breathing."], ["胸口疼。", "Chest pain."], ["流血了，需要包扎。", "Bleeding, needs bandaging."],
      ["交通事故。", "Traffic accident."], ["请叫拖车。", "Please call a tow truck."], ["车险电话是多少？", "What's the insurance hotline?"],
      ["地震了！", "Earthquake!"], ["快去空地。", "Go to open ground quickly."], ["停电了。", "Power outage."],
      ["水龙头漏水。", "The faucet is leaking."], ["门锁不上了。", "The door won't lock."], ["钥匙忘在家里了。", "I forgot my keys at home."],
      ["请找开锁师傅。", "Please find a locksmith."], ["电梯困人了。", "Someone is trapped in the elevator."],
      ["天然气泄漏。", "Gas leak."], ["请关煤气。", "Please turn off the gas."], ["小心！", "Watch out!"],
      ["别动！", "Don't move!"], ["远离这里。", "Stay away from here."], ["安全出口在这边。", "Emergency exit this way."],
      ["请排队。", "Please line up."], ["不要拥挤。", "Don't push."], ["我崴了脚，走不了。", "I sprained my ankle, can't walk."],
      ["请给我水。", "Please give me water."], ["我中暑了。", "I have heatstroke."], ["太冷了，我冻坏了。", "Too cold, I'm freezing."],
      ["请联系我的家人。", "Please contact my family."], ["这是我的紧急联系人。", "This is my emergency contact."],
      ["谢谢你的帮助。", "Thank you for your help."], ["没事了。", "It's OK now."], ["太好了，得救了。", "Great, we're saved."]
    ]
  }
];

function toFlashcards(cards) {
  const trimmed = cards.slice(0, 50);
  while (trimmed.length < 50) {
    trimmed.push(cards[trimmed.length % cards.length]);
  }
  return trimmed.map(([question, answer]) => ({ question, answer }));
}

const catalog = [];

[...vocabSets, ...phraseSets].forEach((set) => {
  const flashcards = toFlashcards(set.cards);
  if (flashcards.length !== 50) {
    console.warn(`${set.id}: expected 50 cards, got ${flashcards.length}`);
  }
  fs.writeFileSync(
    path.join(dataDir, `${set.id}.json`),
    JSON.stringify(flashcards, null, 2),
    "utf8"
  );
  catalog.push({
    id: set.id,
    type: set.type,
    nameEn: set.nameEn,
    nameZh: set.nameZh,
    cardCount: flashcards.length,
    file: `data/${set.id}.json`
  });
});

fs.writeFileSync(
  path.join(dataDir, "catalog.json"),
  JSON.stringify(catalog, null, 2),
  "utf8"
);

console.log(`Generated ${catalog.length} sets in ${dataDir}`);
