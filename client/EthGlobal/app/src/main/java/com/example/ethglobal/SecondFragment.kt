package com.example.ethglobal

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.ethglobal.databinding.FragmentSecondBinding

/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class SecondFragment : Fragment() {

    private var _binding: FragmentSecondBinding? = null
    private var hasCheckedIn = false

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSecondBinding.inflate(inflater, container, false)
        return binding.root

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        getEventName()
        getPrice()
        getPaymentToken()
        getCheckInStatus()
        binding.buttonFirst.setOnClickListener {
            if (!hasCheckedIn) {
                findNavController().navigate(R.id.action_SecondFragment_to_ScanFragment)
            } else {
                (activity as MainActivity).subscribeThisActivity(arguments?.getInt("activity")!!, "TOTO")
            }
        }
    }

    private fun getEventName() {
        val eventName = (activity as MainActivity).getActivityName(arguments?.getInt("activity")!!)
        binding.eventName.text = eventName
    }

    private fun getPrice() {
        val price = (activity as MainActivity).getPrice(arguments?.getInt("activity")!!)
        binding.price.text = price.toString()
    }

    private fun getPaymentToken() {
        val paymentTokenAddress =
            (activity as MainActivity).getPaymentTokenAddress(arguments?.getInt("activity")!!)
        binding.tokenAddress.text = paymentTokenAddress
    }

    private fun getCheckInStatus() {
        hasCheckedIn =
            (activity as MainActivity).getCheckInStatus(arguments?.getInt("activity")!!)

        if (!hasCheckedIn) {
            binding.buttonFirst.text = "SUBSCRIBE"
        } else {
            binding.buttonFirst.text = "CHECK IN"
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}