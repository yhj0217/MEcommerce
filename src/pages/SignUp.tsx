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
import NavBar from "@/components/NavBar/NavBar";

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
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <div className="grid w-full max-w-sm items-center gap-1.5 pb-8">
          <Label htmlFor="email" className="text-xl">
            이메일
          </Label>
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

        <div className="grid w-full max-w-sm items-center gap-1.5 pb-8">
          <Label htmlFor="password" className="text-xl">
            비밀번호
          </Label>
          <div className="relative">
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
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <img src={visible} className="w-6 h-6" alt="visible" />
              ) : (
                <img src={invisible} className="w-6 h-6" alt="invisible" />
              )}
            </button>
          </div>
          {passwordError && (
            <div className="font-bold text-red-600">{passwordError}</div>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 pb-8">
          <Label htmlFor="confirmPassword" className="text-xl">
            비밀번호 확인
          </Label>
          <div className="relative">
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
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <img src={visible} className="w-6 h-6" alt="visible" />
              ) : (
                <img src={invisible} className="w-6 h-6" alt="invisible" />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <div className="font-bold text-red-600">{confirmPasswordError}</div>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 pb-8">
          <Label htmlFor="nickname" className="text-xl">
            사용자 이름
          </Label>
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

        <div className="grid w-full max-w-sm items-center gap-1.5 pb-8">
          <Label className="text-xl">회원 유형을 선택해주세요</Label>
          <ToggleGroup
            type="single"
            value={accountType}
            onValueChange={setAccountType}
            className="flex border-b border-gray-200"
          >
            <ToggleGroupItem
              value="seller"
              className={`w-full text-center py-2 ${
                accountType === "seller"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              판매자
            </ToggleGroupItem>
            <ToggleGroupItem
              value="buyer"
              className={`w-full text-center py-2 ${
                accountType === "buyer"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              구매자(일반 고객)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button onClick={signupHandler} className="mb-8 w-96">
          회원가입 완료하기
        </Button>
      </div>
    </>
  );
};

export default SignUp;
