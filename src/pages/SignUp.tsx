import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import visible from "../assets/visible.svg";
import invisible from "../assets/invisible.svg";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState("buyer");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setAccountType("buyer");
    };
  }, []);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    setPasswordConfirmValid(password === confirmPassword);
  }, [password, confirmPassword]);

  const signupHandler = async () => {
    setEmailError("");
    setNicknameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!passwordConfirmValid) {
      setConfirmPasswordError("입력하신 비밀번호와 다릅니다.");
      return;
    }

    if (!passwordValid) {
      setPasswordError(
        "비밀번호는 영문자, 숫자, 특수문자 모두 포함한 8~20자여야 합니다."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = {
        userId: userCredential.user.uid,
        email: email,
        isSeller: accountType === "seller",
        nickname: nickname,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const collectionRef = collection(db, "users");
      await addDoc(collectionRef, newUser);

      navigate("/");
    } catch (error) {
      const errorCode = (error as { code?: string }).code;
      if (errorCode === "auth/email-already-in-use") {
        setEmailError("이미 사용 중입니다. 다른 이메일을 입력해주세요.");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>회원가입 페이지</h2>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          type="email"
          id="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />
        {emailError && <div>{emailError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 relative">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="영문자, 숫자, 특수문자 포함 최소 8~20자 "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
        >
          {showPassword ? (
            <img src={visible} className="w-6 h-6" alt="visible" />
          ) : (
            <img src={invisible} className="w-6 h-6" alt="invisible" />
          )}
        </button>
        {passwordError && <div>{passwordError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 relative">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
        >
          {showConfirmPassword ? (
            <img src={visible} className="w-6 h-6" alt="visible" />
          ) : (
            <img src={invisible} className="w-6 h-6" alt="invisible" />
          )}
        </button>
        {confirmPasswordError && <div>{confirmPasswordError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="nickname">사용자 이름</Label>
        <Input
          type="text"
          id="nickname"
          placeholder="이름을 입력해 주세요"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameError("");
          }}
        />
        {nicknameError && <div>{nicknameError}</div>}
      </div>

      <Label>회원 구분</Label>
      <ToggleGroup
        type="single"
        value={accountType}
        onValueChange={setAccountType}
      >
        <ToggleGroupItem value="seller">판매자</ToggleGroupItem>
        <ToggleGroupItem value="buyer">구매자(일반 고객)</ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={signupHandler}>회원가입 완료하기</Button>
    </div>
  );
};

export default SignUp;
