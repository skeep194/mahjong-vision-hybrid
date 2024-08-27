# Mahjong Vision

2023-2학기 모바일앱프로그래밍1 팀프로젝트로 만들었던 앱을 ios, android 하이브리드 앱으로 다시 만들어서 런칭까지 해보는 걸 목표로 한 프로젝트입니다.

마작 패를 카메라로 찍어서 입력하면 점수를 계산해서 보여줍니다.

# 개발 환경설정

react native의 개발 환경설정을 따라갑니다.

## 실행

```
yarn ios
yarn android
```

# 앱 화면

<img src="https://github.com/user-attachments/assets/541f6b84-cf9e-4ade-8b45-70a611c199477" width=220 height=400/>
<img src="https://github.com/user-attachments/assets/1dca9702-05bc-4099-800a-7e397f7280c2" width=220 height=400/>
<img src="https://github.com/user-attachments/assets/145e32e7-0ed9-47e5-b330-ac68d22b3067" width=220 height=400/>

# 모델

YOLO v8을 이용해 학습시킨 모델을 tflite로 변환해서 사용했습니다.

데이터셋은 [https://universe.roboflow.com/robosub-s9kbi/mahjong-tiles-model/dataset/2](https://universe.roboflow.com/robosub-s9kbi/mahjong-tiles-model/dataset/2)을 사용했습니다.

# 다운로드

정식 릴리즈 때 추가 예정

# Team

| <img src="https://avatars.githubusercontent.com/u/48646456?v=4" width="150px" /> | <img src="https://avatars.githubusercontent.com/u/55625019?v=4" width="150px" /> |
| :------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|                     [skeep194](https://github.com/skeep194)                      |                     [knewname](https://github.com/knewname)                      |
| :------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|                                   앱 메인 개발                                   |                             컴퓨터 비전/ML 모델 학습                             |
