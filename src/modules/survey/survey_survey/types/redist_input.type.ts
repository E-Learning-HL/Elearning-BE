export type AnswerState = {
  accessToken: string;
  answerToken: string;
  answers: {
    [key: number]: {
      value: any;
      label?: any;
      sequence?: any;
    };
  };
  answersAudio?: {
    [key: number]: {
      blob: Blob;
    };
  };
};

export type RedisUserAnswer = {
  audio: RedisUserInputAudio;
  answers: AnswerState;
};

export type RedisUserInputAudio = {
  [id: number]: RedisQuestionInputAudio;
};

export type RedisQuestionInputAudio = {
  limits: number;
  requests: number;
  currentAudioTime: number;
};
