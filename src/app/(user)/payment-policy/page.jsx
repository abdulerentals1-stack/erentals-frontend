import { Card, CardContent } from "@/components/ui/card";

export default function PaymentPolicy() {
  return (
    <div className=" mx-auto bg-gray-50 md:p-6 space-y-8">
      {/* Page Header */}
     

      {/* Payment Policy Details */}
      <Card className="shadow-md rounded-2xl max-w-5xl mx-auto">
        <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
             <h1 className="text-3xl font-bold text-[#144169] mb-4 text-center">
                Payment Policy
            </h1>
          <p>
            eRentals payments come into the seller bank account registered with
            the online portal through NEFT. The details of each amount are
            available on the seller dashboard via prepaid and postpaid accounts.
          </p>
          <p>
            While prepaid account are payment made by buyers before delivery by
            debit or credit card, net banking, e wallet, etc., postpaid account
            are cash on delivery payments. It also has special settlements, such
            as seller protection fund payments, advertising services, and
            eRentals Fulfillment payments. eRentals makes payments separately
            from both these accounts. The payment is credited to your bank
            account only if there is a positive balance in these two accounts.
          </p>
          <p>
            It may not be out of place to mention that the balance may be
            negative as well due to returns, etc. The settlement amount is the
            Total Order Item value minus eRental’s Marketplace Fee. The
            marketplace fee includes elements such as eRental’s selling
            commission, collection fee, fixed fee, shipping fee, and taxes.
          </p>
          <p>
            Remember, the marketplace fee varies for each product. The total
            selling commission can be different for different products. So do
            the other elements such as shipping fees that are charged with the
            volume of the product. However, the collection fee, as well as the
            fixed fee, remains the same.
          </p>
          <p>
            <strong>Example:</strong> If a product has been sold for Rs. 1000
            online and the marketplace fee is Rs. 200, the amount that will be
            credited into the account of the seller will be Rs. 1000 minus Rs.
            200, i.e. Rs. 800. The same would reflect on the seller dashboard,
            as well as the bank account registered with eRentals.
          </p>
          <p>
            You will be required to provide requisite Know Your Customer (KYC)
            information/documentation to eRentals prior to completion of 24
            (twenty four) months or such other period as may be prescribed under
            applicable laws. If you fail to complete your KYC, no further credit
            shall be allowed in your eRentals Pay balance: Money account.
            However, you will be able to use the balance available in your zon
            Pay balance: Money account.
          </p>
          <p>
            Eligible customers who have Small PPIs (with cash loading facility)
            as on December 24, 2019 may receive a communication from eRentals
            regarding the conversion of their accounts to Small PPIs (without
            cash loading facility). Such conversion will be done within such
            time period as intimated by eRentals, but no later than 24
            (twenty-four) months from the date of creation of your Small PPIs
            (with cash loading facility).
          </p>
          <p>
            If you wish to continue using your Small PPIs (with cash loading
            facility), please notify eRentals of the same using the weblink
            provided in such communication within a period of 90 days from
            receipt of such communication or before expiry of 24 (twenty four)
            months from the date of creation of your Small PPIs (with cash
            loading facility) (whichever is earlier).
          </p>
          <p>
            All customers holding Small PPIs (with cash loading facility) post
            December 24, 2019, i.e., customers other than the eligible customers
            as mentioned above, will be to upgrade to a full KYC account by
            completing full KYC with eRentals.
          </p>

           <h2 className="text-2xl font-semibold text-[#144169] text-center">
            Document Required - Documentation and Verification Policy
          </h2>
          <p>
            The Subscriber allows the Company to access their credit information
            from Credit Information Companies (Recordant Private Limited) in
            order to assess their creditworthiness and curate personalized
            products.
          </p>
          <p>
            Any and all personal data and financial information (including the
            credit score) whether relating to the Subscriber, its personnel, or
            other data subjects, shall be provided by the Subscriber to the
            Company in compliance with applicable data protection laws and the
            Subscriber, from the date hereof, permits the Company to process and
            transfer such data itself and by its branches, representative ones,
            subsidiaries, affiliates, legal and regulatory authorities, and
            designated third parties for enabling the Company to assess the
            offer made by the Subscriber or to undertake legal compliances
            (including inter alia undertaking KYC) applicable to the Company in
            relation to the proposed Subscription or providing services or
            Experiences to the Subscriber or for enabling the Company to manage
            the relationship with the Subscriber or undertaking statistical and
            risk analysis, reporting and for compliance with the applicable
            laws.
          </p>
           <h2 className="text-2xl font-semibold text-[#144169]">B2C</h2>
          <p>
            All prospective Customers of eRentals must comply with the
            documentation and verification policy. Customers are required to
            update the following documents during placing the order for their
            desired products. eRentals reserves the right to cancel any order as
            per internal policies subject to documentation / Field verification.
            eRentals might request additional documents on a case-to-case basis.
            The same will be notified via email and SMS.
          </p>

           <h3 className="text-xl font-semibold text-[#144169]">
            Working Professionals / Employed / Salaried Professionals
          </h3>
          <h4 className="font-medium">Mandatory Documents</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Adhaar Card</li>
            <li>Pan Card</li>
            <li>Recent passport size Photo</li>
            <li>Company name, address and Official Email id</li>
          </ul>

           <h3 className="text-xl font-semibold text-[#144169]">Self Employed</h3>
          <h4 className="font-medium">Mandatory Documents</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Adhaar Card</li>
            <li>Pan Card</li>
            <li>Recent passport size Photo</li>
            <li>GST number</li>
            <li>Address proof and Official Email id</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#144169]">Freelance</h3>
          <h4 className="font-medium">Mandatory Documents</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Adhaar Card</li>
            <li>Pan Card</li>
            <li>Recent passport size Photo</li>
            <li>Address proof and Official Email id</li>
          </ul>

           <h3 className="text-xl font-semibold text-[#144169]">Students</h3>
          <h4 className="font-medium">Mandatory Documents</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Adhaar Card</li>
            <li>Pan Card</li>
            <li>Govt id card</li>
            <li>Recent passport size Photo</li>
            <li>Address proof and Official Email id</li>
            <li>Working Parent / Guardian Permanent address proof</li>
          </ul>

          <h4 className="font-medium">Additional Documents</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Parents Bank Statement</li>
            <li>Parents Govt id</li>
            <li>
              * 6 months Bank Statement might be asked to be uploaded in some
              cases
            </li>
          </ul>

          <p className="text-sm text-gray-600">
            Note: While we appreciate you sharing your documents, please note
            that ‘eRentals’ reserves the right to confirm or decline the order
            on a case by case basis.
          </p>

          <h3 className="text-xl font-semibold text-[#144169]">
            Foreign Nationals
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy of Visa</li>
            <li>Copy of Passport</li>
            <li>HR Letter / Rental Agreement / Recent Utility Bill (Delivery Address Proof)</li>
            <li>Local Company / Business Reference</li>
            <li>Foreign nationals with Employment visas only eligible for availing services</li>
            <li>Visa expiry should be 6 Months +</li>
            <li>Documents will be taken offline for foreign nationals</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#144169]">NRI / PIO</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Visa / PIO Card</li>
            <li>Passport</li>
            <li>HR Letter / Rental Agreement / Recent Utility Bill (Delivery Address Proof)</li>
            <li>Local Company / Business Reference</li>
          </ul>
          <p className="text-sm text-gray-600">
            Note: While we appreciate you sharing your documents, please note
            that ‘eRentals’ reserves the right to confirm or decline the order
            on a case by case basis.
          </p>

           <h2 className="text-2xl font-semibold text-[#144169]">B2B</h2>
          <p>
            Customers renting for business use for their rented / own commercial
            establishments.
          </p>

          <h4 className="font-medium">Note:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              eRentals will not entertain orders from Customers staying in PGs,
              Hostels, and Hotels as the same is considered as a temporary
              requirement.
            </li>
            <li>
              eRentals reserves the right to cancel any order as per internal
              policies subject to documentation / Field verification.
            </li>
            <li>
              eRentals might request additional documents on a case-to-case
              basis. The same will be notified via email and SMS.
            </li>
            <li>
              Documentation of B2B orders will be taken offline including
              contract.
            </li>
            <li>
              The advance deposit amount varies depending on the order value for
              B2B orders.
            </li>
          </ul>

           <h3 className="text-xl font-semibold text-[#144169]">Sole Proprietor</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              PAN CARD of the business entity/ Sole proprietor issued by the
              Income Tax Department of India.
            </li>
            <li>
              Address proof of the proprietor ( DL/ Aadhar/ Voter Id/ Passport)
            </li>
            <li>
              GST certificate/ Sales and Income tax returns / Registration or
              licensing document issued by the Central Government or State
              Government Departments or municipal authorities / Certificate/
              registration document issued by the sales tax/professional tax
              authorities.
            </li>
            <li>Delivery Address Proof</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#144169]">Partnership Firms</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>PAN CARD copy of the firm</li>
            <li>Registered Partnership Deed</li>
            <li>
              Power of Attorney granted to a partner of an employee of the firm
              to transact business on its behalf.
            </li>
            <li>
              ID/address proof of the main partners and persons holding the Power
              of Attorney
            </li>
            <li>Proof of Legal name</li>
            <li>Delivery Address Proof</li>
          </ul>


          <h3 className="text-xl font-semibold text-[#144169]">
            Limited Liability Partnership (LLP)
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>PAN CARD copy of the LLP</li>
            <li>Copy of the LLP agreement</li>
            <li>Copy of the Incorporation document and DPIN of the designated partners</li>
            <li>Copy of the certificate of Registration issued by the ROC concerned</li>
            <li>
              Copy of the Resolution to avail furniture on rent from M/s House of
              Kieraya Pvt. Ltd & Power of Attorney, if granted, to its managers,
              officers or employees
            </li>
            <li>
              Government Issued Permanent address proof - DL/ UID/ Passport/
              Voter Id (Permanent Address Proof) of the authorized person
            </li>
            <li>
              GST certificate / Registration or licensing document issued by the
              Central Government or State Government Departments or municipal
              authorities / Certificate/registration document issued by the sales
              tax/professional tax authorities
            </li>
            <li>
              Current Address Proof - Rental Agreement/ Recent Utility Bill
              (Delivery Address Proof)
            </li>
          </ul>

            <h3 className="text-xl font-semibold text-[#144169]">Companies / Pvt Ltd</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>PAN CARD of the company</li>
            <li>Certificate of incorporation/commencement of business and DIN</li>
            <li>Memorandum & Articles of Association</li>
            <li>
              Authorization letter for entering into a contract to avail furniture
              on rent from House of Kieraya Pvt. Ltd & Power of Attorney, if
              granted, to its managers, officers or employees
            </li>
            <li>
              ID and address proof of the authorized signatories duly attested by
              the company
            </li>
            <li>List of directors with contact numbers</li>
            <li>Delivery/mailing address proof of the company</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#144169]">
            Trust / Clubs / Associations
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Certificate of Registration</li>
            <li>Power of Attorney granted to transact business on its behalf</li>
            <li>
              ID and address proof of the authorized signatories duly attested by
              the company
            </li>
            <li>
              Any document listing out the names and addresses of the trustees,
              beneficiaries, and those holding power of Attorney
            </li>
            <li>Resolution of the managing body of the foundation</li>
            <li>
              Declaration of Trust/Bye-Law of society/Bye-law of Association/
              Bye-law of the club
            </li>
            <li>
              Attach the name and address of the founder, Manager/director, and
              the beneficiaries
            </li>
            <li>
              Telephone/fax number, Telephone bill, Utility bill apart from the
              above for delivery proof
            </li>
          </ul>

          <p className="text-sm text-gray-600">
            Note: While we appreciate you sharing your documents, please note
            that ‘eRentals’ reserves the right to confirm or decline the order on
            a case by case basis.
          </p>
        </CardContent>
      </Card>




</div>
      )
      
}
