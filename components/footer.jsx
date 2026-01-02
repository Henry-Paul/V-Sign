export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between">
        <div>
          <h4 className="font-bold text-primary">V SIGN</h4>
          <p className="text-sm text-gray-600 max-w-md">In-house fabrication • Free site survey • 3–10 year warranties. Serving Andhra Pradesh & Telangana.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <h5 className="font-medium">Contact</h5>
          <p className="text-sm text-gray-600">+91 99XXXXXXX • hello@vsign.example</p>
          <p className="text-sm text-gray-600">Hyderabad, Telangana</p>
        </div>
      </div>
      <div className="bg-primary/5 border-t">
        <div className="container mx-auto px-4 py-3 text-xs text-gray-500 text-center">© {new Date().getFullYear()} V SIGN. All rights reserved.</div>
      </div>
    </footer>
  );
}
