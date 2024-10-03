import User from "../app/modules/auth/auth.model";

export const generateDonorId = async (): Promise<string> => {
    const lastDonor = await User.findOne({ role: 'donor' }).sort({ donor_id: -1 }).exec();
    if (!lastDonor || !lastDonor.donor_id) {
      return '1000';
    }
    const nextDonorId = (parseInt(lastDonor.donor_id, 10) + 1).toString();
    return nextDonorId;
  };