declare global {
  interface Window { Paddle: any }
}

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
const LIFETIME_ID = process.env.NEXT_PUBLIC_PADDLE_LIFETIME_ID || "";

export function initPaddle() {
  return new Promise<void>((resolve) => {
    const check = setInterval(() => {
      if (window.Paddle) {
        clearInterval(check);
        window.Paddle.Initialize({
          token: CLIENT_TOKEN,
          eventCallback: (event: any) => {
            if (event.name === "checkout.completed") {
              localStorage.setItem("ktour_pro", "true");
              window.location.reload();
            }
          }
        });
        resolve();
      }
    }, 200);
    setTimeout(() => clearInterval(check), 10000);
  });
}

export async function openCheckout() {
  await initPaddle();
  window.Paddle.Checkout.open({
    items: [{ priceId: LIFETIME_ID, quantity: 1 }]
  });
}

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  // 3일 무료 체험 확인
  const installDate = localStorage.getItem("ktour_install_date");
  if (!installDate) {
    localStorage.setItem("ktour_install_date", Date.now().toString());
    return true; // 첫 설치 - 무료
  }
  const daysPassed = (Date.now() - parseInt(installDate)) / (1000 * 60 * 60 * 24);
  if (daysPassed <= 3) return true; // 3일 이내 - 무료
  return localStorage.getItem("ktour_pro") === "true";
}

export function getTrialDaysLeft(): number {
  if (typeof window === "undefined") return 3;
  const installDate = localStorage.getItem("ktour_install_date");
  if (!installDate) return 3;
  const daysPassed = (Date.now() - parseInt(installDate)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(3 - daysPassed));
}